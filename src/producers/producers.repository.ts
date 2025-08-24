import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateProducerDto } from './dto/create-producer.dto';

@Injectable()
export class ProducersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProducerDto: CreateProducerDto) {
    return this.prisma.producer.create({
      data: createProducerDto,
    });
  }

  async findAll() {
    return this.prisma.producer.findMany();
  }

  async findById(id: number) {
    return this.prisma.producer.findUnique({
      where: { id },
    });
  }

  async findByDocument(document: string) {
    return this.prisma.producer.findUnique({
      where: { document },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.producer.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateProducerDto: Partial<CreateProducerDto>) {
    return this.prisma.producer.update({
      where: { id },
      data: updateProducerDto,
    });
  }

  async remove(id: number) {
    return this.prisma.producer.delete({
      where: { id },
    });
  }
}
