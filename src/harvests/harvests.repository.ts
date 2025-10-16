import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { GetHarvestHistoryQueryDto } from './dto/get-harvest-history-query.dto';
import { Prisma, HarvestStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class HarvestsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova safra e, opcionalmente, seus plantios aninhados.
   */
  create(createHarvestDto: CreateHarvestDto) {
    const { producerId, plantings, ...harvestData } = createHarvestDto;

    return this.prisma.harvest.create({
      data: {
        ...harvestData,
        producer: { connect: { id: producerId } },
        plantings: {
          create: plantings?.map((p) => ({
            name: p.name,
            plantingDate: p.plantingDate,
            expectedHarvestDate: p.expectedHarvestDate,
            quantityPlanted: p.quantityPlanted,
            product: { connect: { id: p.productId } },
            areas: { connect: p.areaIds.map((id) => ({ id })) },
          })),
        },
      },
      include: {
        producer: true,
        plantings: { include: { areas: true, product: true } },
      },
    });
  }

  /**
   * Busca todas as safras.
   */
  findAll() {
    return this.prisma.harvest.findMany({
      include: {
        producer: true,
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
        plantings: {
          include: {
            areas: true,
            product: true,
          },
        },
      },
    });
  }

  /**
   * Busca uma safra pelo nome.
   */
  findByName(name: string) {
    return this.prisma.harvest.findUnique({
      where: { name },
    });
  }

  /**
   * Busca todas as safras de um produtor específico.
   */
  findByProducerId(producerId: number) {
    return this.prisma.harvest.findMany({
      where: { producerId },
      include: {
        plantings: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  /**
   * Busca o histórico de safras de um produtor com base em filtros.
   */
  findHistoryByProducer(
    producerId: number,
    filters: GetHarvestHistoryQueryDto,
  ) {
    const where: Prisma.HarvestWhereInput = {
      producerId: producerId,
    };

    if (filters.status) {
      where.status = filters.status;
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

  /**
   * Busca safras em andamento de um produtor.
   */
  async findInProgressByProducer(producerId: number) {
    return this.prisma.harvest.findMany({
      where: {
        producerId,
        status: HarvestStatus.in_progress,
      },
      include: {
        producer: true,
        plantings: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  /**
   * Atualiza os dados de uma safra.
   */
  update(id: number, updateHarvestDto: UpdateHarvestDto) {
    return this.prisma.harvest.update({
      where: { id },
      data: updateHarvestDto,
      include: {
        producer: true,
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

  /**
   * Calcula a área total (em m²) de uma safra somando as áreas únicas
   * de todos os seus plantios associados.
   */
  async getTotalAreaForHarvest(harvestId: number): Promise<number> {
    // 1. Busca a safra e inclui os plantios e as áreas de cada plantio.
    const harvest = await this.prisma.harvest.findUnique({
      where: { id: harvestId },
      include: {
        plantings: {
          include: {
            areas: true,
          },
        },
      },
    });

    if (!harvest || !harvest.plantings) {
      return 0;
    }

    // 2. Extrai e achata a lista de todas as áreas de todos os plantios.
    const allAreas = harvest.plantings.flatMap((planting) => planting.areas);

    // 3. Remove áreas duplicadas, garantindo que cada área seja contada apenas uma vez.
    const uniqueAreas = Array.from(
      new Map(allAreas.map((area) => [area.id, area])).values(),
    );

    // 4. Soma a área (em m²) de cada área única.
    const totalAreaDecimal = uniqueAreas.reduce(
      (sum, area) => sum.plus(area.areaM2),
      new Decimal(0),
    );

    // 5. Converte o resultado de Decimal para number.
    return totalAreaDecimal.toNumber();
  }
}
