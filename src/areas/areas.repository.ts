import { Injectable } from "@nestjs/common";
import { PrismaService } from '../shared/prisma/prisma.service';

@Injectable()
export class AreasRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.area.findUnique({
      where: { id },
      include: {
        soilType: true,
        irrigationType: true,
      },
    });
  }

  async findByProducerId(producerId: number) {
    return this.prisma.area.findMany({
      where: { producerId },
      include: {
        soilType: true,
        irrigationType: true,
      },
    });
  }
}
