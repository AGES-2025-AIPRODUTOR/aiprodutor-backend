import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { Prisma } from '@prisma/client';
import { GetHarvestHistoryQueryDto } from './dto/get-harvest-history-query.dto';

@Injectable()
export class HarvestsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova safra, associando-a a um produtor e a uma lista de áreas.
   */
  create(createHarvestDto: CreateHarvestDto) {
    const { areaIds, producerId, plantings, ...harvestData } = createHarvestDto;

    return this.prisma.harvest.create({
      data: {
        ...harvestData,
        producer: { connect: { id: producerId } },
        areas: { connect: areaIds.map((id) => ({ id })) },
        
        plantings: {
          create: plantings?.map(p => ({
            name: p.name,
            plantingDate: p.plantingDate,
            expectedHarvestDate: p.expectedHarvestDate,
            quantityPlanted: p.quantityPlanted,
            
            product: { connect: { id: p.productId } },
            variety: { connect: { id: p.varietyId } },
            areas: { connect: p.areaIds.map((id) => ({ id })) },
          })),
        },
      },
      include: {
        producer: true,
        areas: true,
        plantings: { include: { areas: true } },
      },
    });
  }

  /**
   * Busca todas as safras, incluindo suas relações.
   */
  findAll() {
    return this.prisma.harvest.findMany({
      include: {
        producer: true,
        areas: true,
        plantings: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  /**
   * Busca uma safra específica pelo ID, incluindo todas as suas relações.
   */
  findById(id: number) {
    return this.prisma.harvest.findUnique({
      where: { id },
      include: {
        producer: true,
        areas: true,
        plantings: {
          include: {
            areas: true, // Inclui as áreas de cada plantio
            product: true,
            variety: true,
          },
        },
      },
    });
  }
  
  /**
   * Busca todas as safras de um produtor específico.
   */
  findByProducerId(producerId: number) {
    return this.prisma.harvest.findMany({
        where: { producerId },
        include: {
            areas: true,
            plantings: true,
        },
        orderBy: {
            startDate: 'desc',
        },
    });
  }

  /**
   * Atualiza os dados de uma safra, incluindo a lista de áreas associadas.
   */
  update(id: number, updateHarvestDto: UpdateHarvestDto) {
    const { areaIds, ...harvestData } = updateHarvestDto;

    return this.prisma.harvest.update({
      where: { id },
      data: {
        ...harvestData,
        ...(areaIds && { areas: { set: areaIds.map((id) => ({ id })) } }),
      },
      include: {
        producer: true,
        areas: true,
        plantings: true,
      },
    });
  }

  /**
   * Remove uma safra do banco de dados.
   */
  remove(id: number) {
    return this.prisma.harvest.delete({
      where: { id },
    });
  }

  async findHistoryByProducer(
    producerId: number,
    filters: GetHarvestHistoryQueryDto,
  ) {
    const where: Prisma.HarvestWhereInput = {
      producerId: producerId,
    };

    if (filters.status) {
      where.status = { equals: filters.status, mode: 'insensitive' };
    }
    if (filters.safraName) {
      where.name = { contains: filters.safraName, mode: 'insensitive' };
    }
    if (filters.safraInitialDate) {
      where.startDate = { gte: new Date(filters.safraInitialDate) };
    }
    if (filters.safraEndDate) {
      where.endDate = { lte: new Date(filters.safraEndDate) };
    }

    return this.prisma.harvest.findMany({
      where,
      include: {
        areas: true,
        plantings: {
          include: {
            areas: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }
    findByName(name: string) {
    return this.prisma.harvest.findUnique({
      where: { name },
    });
  }

  async getTotalAreaForHarvest(harvestId: number): Promise<number> {
    const result = await this.prisma.$queryRaw<{ total_area: number }[]>`
      SELECT SUM(ST_Area(a.polygon::geography)) as total_area
      FROM "public"."areas" AS a
      INNER JOIN "public"."_AreaToHarvest" AS ah ON a.id = ah."A"
      WHERE ah."B" = ${harvestId};
    `;

    return result[0]?.total_area || 0;
  }

  findOneByProducer(harvestId: number, producerId: number) {
    return this.prisma.harvest.findFirst({
      where: {
        id: harvestId,
        producerId: producerId,
      },
      include: {
        areas: true,
        plantings: true,
      },
    });
  }

  async findInProgressByProducer(producerId: number) {
    return this.prisma.harvest.findMany({
      where: {
        producerId,
        status: 'Ativa', // Considerando "Ativa" como em andamento
      },
    });
  }
}