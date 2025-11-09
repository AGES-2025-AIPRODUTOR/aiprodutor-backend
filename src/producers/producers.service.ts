import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateProducerDto } from './dto/create-producer.dto';
import { ProducersRepository } from './producers.repository';
import { PlantingHistoryResponseDto } from './dto/planting-history-response.dto';

@Injectable()
export class ProducersService {
  constructor(private readonly repository: ProducersRepository) {}

  private normalizePayload(dto: CreateProducerDto): CreateProducerDto {
    return {
      ...dto,
      document: dto.document?.replace(/\D/g, ''),
      phone: dto.phone?.replace(/\D/g, ''),
      zipCode: dto.zipCode?.replace(/\D/g, ''),
    };
  }

  private validatePayload(dto: CreateProducerDto) {
    // Document: CPF (11) or CNPJ (14)
    if (!/^(\d{11}|\d{14})$/.test(dto.document)) {
      throw new BadRequestException(
        'document deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.',
      );
    }
    // Phone: 10 or 11 digits (Brazil)
    if (!/^\d{10,11}$/.test(dto.phone)) {
      throw new BadRequestException(
        'phone deve conter DDD e número, com 10 ou 11 dígitos',
      );
    }
    // ZipCode: 8 digits (CEP)
    if (!/^\d{8}$/.test(dto.zipCode)) {
      throw new BadRequestException('zipCode deve conter 8 dígitos.');
    }
  }

  async create(createProducerDto: CreateProducerDto) {
    createProducerDto = this.normalizePayload(createProducerDto);

    // Validação manual dos campos
    this.validatePayload(createProducerDto);

    // Regra de negócio: verificar se já existe um produtor com o mesmo documento ou e-mail
    const existingProducerByDoc = await this.repository.findByDocument(
      createProducerDto.document,
    );
    if (existingProducerByDoc) {
      throw new ConflictException('Já existe um produtor com este documento.');
    }

    const existingProducerByEmail = await this.repository.findByEmail(
      createProducerDto.email,
    );
    if (existingProducerByEmail) {
      throw new ConflictException('Já existe um produtor com este e-mail.');
    }

    return this.repository.create(createProducerDto);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findAllOrByDocument(cpfCnpj?: string) {
    if (cpfCnpj) {
      return this.findDocument(cpfCnpj);
    }
    return this.findAll();
  }

  async findOne(id: number) {
    const producer = await this.repository.findById(id);
    if (!producer) {
      throw new NotFoundException(`Produtor com o ID #${id} não encontrado.`);
    }
    return producer;
  }

  async findDocument(document: string) {
    const producer = await this.repository.findByDocument(document);
    if (!producer) {
      throw new NotFoundException(
        `Produtor com o CPF/CNPJ #${document} não encontrado.`,
      );
    }
    return producer;
  }

  async update(id: number, updateProducerDto: Partial<CreateProducerDto>) {
    // Garante que o produtor existe antes de tentar atualizar
    await this.findOne(id);
    return this.repository.update(id, updateProducerDto);
  }

  async remove(id: number) {
    // Garante que o produtor existe antes de tentar remover
    await this.findOne(id);
    return this.repository.remove(id);
  }

  async getPlantingHistory(
    producerId: number,
  ): Promise<PlantingHistoryResponseDto[]> {
    // 1. Garante que o produtor existe
    await this.findOne(producerId);

    // 2. Chama o repositório com a query correta
    const historyRecords =
      await this.repository.findPlantingHistory(producerId);

    // 3. Mapeia e formata os dados para o DTO de resposta
    return historyRecords.map((record) => ({
      areaName: record.areaName,
      plantingName: record.plantingName,
      productName: record.productName,
      safraName: record.safraName,
      areaStatus: record.areaStatus,
      plantingDate: record.plantingDate,
      harvestDate: record.harvestDate,
      quantityPlanted: record.quantityPlanted,
      quantityHarvested: record.quantityHarvested,
      areaM2: Number(record.areaM2),
    }));
  }

  async generateGeneralViewReport(producerId: number): Promise<any> {
    const totalArea = await this.repository.getTotalAreaInProgress(producerId);
    const uniqueProductsCount = await this.repository.getUniqueInProgressProductsCount(
      producerId,
    );
    const expectedYield = await this.repository.getExpectedYield(producerId);
    const averageEfficiency = expectedYield / totalArea;

    return {
      totalAreaHectares: totalArea,
      uniqueProductsCount,
      expectedYield: parseFloat(expectedYield.toFixed(1)),
      averageEfficiency: parseFloat(averageEfficiency.toFixed(1)),
    };
  }

}
