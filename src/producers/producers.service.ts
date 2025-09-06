import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProducerDto } from './dto/create-producer.dto';
import { ProducersRepository } from './producers.repository';

@Injectable()
export class ProducersService {
  constructor(private readonly repository: ProducersRepository) {}

  async create(createProducerDto: CreateProducerDto) {
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

  async findOne(id: number) {
    const producer = await this.repository.findById(id);
    if (!producer) {
      throw new NotFoundException(`Produtor com o ID #${id} não encontrado.`);
    }
    return producer;
  }

  async findOneByDocument(document: string) {
    return await this.repository.findByDocument(document);
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
}
