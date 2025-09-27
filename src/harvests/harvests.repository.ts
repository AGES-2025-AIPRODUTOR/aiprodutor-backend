import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';

@Injectable()
export class HarvestsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // O create agora só recebe dados da própria safra
  create(createHarvestDto: CreateHarvestDto) {
    return this.prisma.harvest.create({
      data: createHarvestDto,
    });
  }

  findAll() {
    return this.prisma.harvest.findMany({
      include: {
        plantings: true, // Inclui a lista de plantios
      },
    });
  }

  findById(id: number) {
    return this.prisma.harvest.findUnique({
      where: { id },
      include: {
        plantings: true, // Inclui a lista de plantios
      },
    });
  }

  // O update não lida mais com plantingId
  update(id: number, updateHarvestDto: UpdateHarvestDto) {
    return this.prisma.harvest.update({
      where: { id },
      data: updateHarvestDto,
    });
  }

  remove(id: number) {
    // Adicionar lógica para lidar com plantios órfãos se necessário
    return this.prisma.harvest.delete({
      where: { id },
    });
  }
}
