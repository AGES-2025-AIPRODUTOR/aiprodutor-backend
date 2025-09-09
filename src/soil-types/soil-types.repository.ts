import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { SoilTypes } from './entities/soil-types.entity';

@Injectable()
export class SoilTypesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    name: string;
    description?: string;
  }): Promise<SoilTypes> {
    return this.prisma.soilType.create({ data });
  }

  async findById(id: number) {
    return this.prisma.soilType.findUnique({ where: { id } });
  }

  async findAll(): Promise<SoilTypes[]> {
    return this.prisma.soilType.findMany();
  }

  async update(id: number, data: { name?: string; description?: string }): Promise<SoilTypes> {
    return this.prisma.soilType.update({
      where: { id },
      data,
    });
  }

  
}
