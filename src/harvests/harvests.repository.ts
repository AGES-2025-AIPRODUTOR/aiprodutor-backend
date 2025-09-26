import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';

@Injectable()
export class HarvestsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createHarvestDto: CreateHarvestDto) {
  // Prepare os dados com valores padrão
  const harvestData = {
    name: createHarvestDto.name,
    startDate: createHarvestDto.startDate,
    endDate: createHarvestDto.endDate || createHarvestDto.startDate, // Valor padrão
    status: createHarvestDto.status || 'Ativa',
    cycle: createHarvestDto.cycle || 'Verão',
    producerId: createHarvestDto.producerId,
  };

  return this.prisma.harvest.create({
    data: harvestData,
  });
}

  async findAll() {
    return this.prisma.harvest.findMany();
  }

  async findById(id: number) {
    return this.prisma.harvest.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateHarvestDto: Partial<CreateHarvestDto>) {
    return this.prisma.harvest.update({
      where: { id },
      data: updateHarvestDto,
    });
  }

  async remove(id: number) {
    return this.prisma.harvest.delete({
      where: { id },
    });
  }

  async findHarvestWithRelations(id: number) {
    return this.prisma.harvest.findUnique({
      where: { id },
      include: {
        plantings: {
          include: {
            area: true,
            variety: true,
          }
        },
        producer: true,
      },
    });
  }
}