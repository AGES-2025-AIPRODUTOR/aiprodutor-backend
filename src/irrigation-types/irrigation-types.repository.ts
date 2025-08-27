import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';

@Injectable()
export class IrrigationTypesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.irrigationType.findUnique({ where: { id } });
  }
}
