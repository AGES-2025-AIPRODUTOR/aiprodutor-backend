import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { PlantingRequestDto } from './dto/planting-request.dto';
import { UpdatePlantingDto } from './dto/update-planting.dto';

@Injectable()
export class PlantingsRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(plantingRequestDto: PlantingRequestDto) {
    return this.prisma.planting.create({
      data: {
        areaId: plantingRequestDto.areaId,
        productId: plantingRequestDto.productId,
        varietyId: plantingRequestDto.varietyId,
        name: plantingRequestDto.name,
        color: plantingRequestDto.color,
        plantingDate: plantingRequestDto.plantingDate,
        plantingEndDate: plantingRequestDto.plantingEndDate,
        expectedHarvestDate: plantingRequestDto.expectedHarvestDate,
        quantityPlanted: plantingRequestDto.quantityPlanted,
        quantityHarvested: plantingRequestDto.quantityHarvested,
      },
    });
  }

  async findAll() {
    return this.prisma.planting.findMany();
  }

  async findById(id: number) {
    return this.prisma.planting.findUnique({
      where: { id },
    });
  }

  async update(id: number, updatePlantingDto: Partial<UpdatePlantingDto>) {
    return this.prisma.planting.update({
      where: { id },
      data: updatePlantingDto,
    });
  }

  async remove(id: number) {
    return this.prisma.planting.delete({
      where: { id },
    });
  }

  async existsByVarietyId(varietyId: number): Promise<boolean> {
    const planting = await this.prisma.planting.findFirst({
      where: { varietyId },
    });
    return !!planting;
  }

  async findByProductId(productId: number) {
    return this.prisma.planting.findMany({
      where: { productId },
    });
  }

  
}
