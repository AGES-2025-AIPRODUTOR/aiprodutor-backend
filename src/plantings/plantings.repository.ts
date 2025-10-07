import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreatePlantingDto } from './dto/create-planting.dto';
import { UpdatePlantingDto } from './dto/update-planting.dto';

@Injectable()
export class PlantingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createPlantingDto: CreatePlantingDto) {
    const { areaIds, ...plantingData } = createPlantingDto;

    return this.prisma.planting.create({
      data: {
        ...plantingData,
        areas: {
          connect: areaIds.map((id) => ({ id })),
        },
      },
      include: {
        areas: true,
      },
    });
  }
  async findAll() {
    return this.prisma.planting.findMany({
      include: { areas: true },
    });
  }

  findById(id: number) {
    return this.prisma.planting.findUnique({
      where: { id },
      include: { areas: true },
    });
  }

  update(id: number, updatePlantingDto: UpdatePlantingDto) {
    return this.prisma.planting.update({
      where: { id },
      data: updatePlantingDto,
      include: { areas: true },
    });
  }

  async remove(id: number) {
    return this.prisma.planting.delete({
      where: { id },
    });
  }

  findByProductId(productId: number) {
    return this.prisma.planting.findMany({
      where: { productId },
      include: { areas: true },
    });
  }

  findByProducerId(producerId: number) {
    return this.prisma.planting.findMany({
      where: { harvest: { producerId: producerId } },
      include: {
        areas: true,
        harvest: true,
      },
      orderBy: { plantingDate: 'desc' },
    });
  }
}
