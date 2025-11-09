import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateProducerDto } from './dto/create-producer.dto';
import { ProducersRepository } from './producers.repository';
import { PlantingHistoryResponseDto } from './dto/planting-history-response.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { PlantedAreaMonthlyResponseDto } from './dto/planted-area-monthly-response.dto';

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

  async getPlantedAreaMonthlyReport(
  producerId: number
  ): Promise<PlantedAreaMonthlyResponseDto[]> {
  const harvests = await this.repository.getActiveHarvests(producerId);

  const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

  const today = new Date();
  type MonthInfo = {
    mes: string;
    ano: number;
    key: string;         // e.g. "2025-11"
    y: number;           // year
    m: number;           // 0..11
  };

  const monthsToShow: MonthInfo[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    monthsToShow.push({
      mes: monthNames[d.getMonth()],
      ano: d.getFullYear(),
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      y: d.getFullYear(),
      m: d.getMonth(),
    });
  }

  const totals = new Map<string, number>();
  monthsToShow.forEach(mi => totals.set(mi.key, 0));

  for (const harvest of harvests) {
    const start = harvest.startDate ? new Date(harvest.startDate) : null;
    const end = harvest.endDate ? new Date(harvest.endDate) : null;

    // Unique areas once per harvest
    const allAreas = harvest.plantings.flatMap((p) => p.areas);
    const uniqueAreas = Array.from(new Map(allAreas.map(a => [a.id, a])).values());
    const totalAreaHa = uniqueAreas
      .reduce((sum, a) => sum.plus(a.areaM2), new Decimal(0))
      .dividedBy(10000) // m² -> ha
      .toNumber();

    // Add to each month that overlaps the harvest period
    for (const mi of monthsToShow) {
      const monthStart = new Date(mi.y, mi.m, 1);
      const monthEnd = new Date(mi.y, mi.m + 1, 0, 23, 59, 59, 999);

      const overlaps =
        (!start || start <= monthEnd) &&
        (!end || end >= monthStart);

      if (overlaps) {
        totals.set(mi.key, (totals.get(mi.key) ?? 0) + totalAreaHa);
      }
    }
  }

  return monthsToShow.map((mi) => ({
    mes: mi.mes,                     // string
    ano: mi.ano,                     // number
    areaPlantadaHa: Number(((totals.get(mi.key) ?? 0)).toFixed(1)),
  }));
}
}
