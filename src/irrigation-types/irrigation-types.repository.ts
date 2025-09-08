import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { IrrigationTypes } from './entities/irrigation-types.entity';

@Injectable()
export class IrrigationTypesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    name: string;
    description?: string;
  }): Promise<IrrigationTypes> {
    return this.prisma.irrigationType.create({ data });
  }

  async findById(id: number) {
    return this.prisma.irrigationType.findUnique({ where: { id } });
  }

  async findAll(): Promise<IrrigationTypes[]> {
    return this.prisma.irrigationType.findMany();
  }
}
