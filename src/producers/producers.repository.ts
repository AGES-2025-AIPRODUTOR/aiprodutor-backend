import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { Prisma, HarvestStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ProducersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProducerDto: CreateProducerDto) {
    return this.prisma.producer.create({
      data: createProducerDto,
    });
  }

  async findAll() {
    return this.prisma.producer.findMany();
  }

  async findById(id: number) {
    return this.prisma.producer.findUnique({
      where: { id },
    });
  }

  async findByDocument(document: string) {
    return this.prisma.producer.findUnique({
      where: { document },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.producer.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateProducerDto: Partial<CreateProducerDto>) {
    return this.prisma.producer.update({
      where: { id },
      data: updateProducerDto,
    });
  }

  async remove(id: number) {
    return this.prisma.producer.delete({
      where: { id },
    });
  }

  async findPlantingHistory(producerId: number): Promise<any[]> {
    return this.prisma.$queryRaw(Prisma.sql`
      SELECT
        a.name AS "areaName",
        a."isActive" AS "areaStatus",
        ST_Area(a.polygon::geography) AS "areaM2",
        p.name AS "plantingName",
        p."plantingDate",
        p."quantityPlanted",
        p."quantityHarvested",
        prod.name AS "productName",
        h.name AS "safraName",
        h."endDate" AS "harvestDate"
      FROM "public"."plantings" AS p
      INNER JOIN "public"."_AreaToPlanting" AS ap ON p.id = ap."B"
      INNER JOIN "public"."areas" AS a ON ap."A" = a.id
      LEFT JOIN "public"."products" AS prod ON p."productId" = prod.id
      LEFT JOIN "public"."harvests" AS h ON p."harvestId" = h.id
      WHERE a."producerId" = ${producerId}
      ORDER BY p."plantingDate" DESC;
    `);
  }

  async getTotalAreaInProgress(producerId: number): Promise<number> {
    const producer = await this.prisma.producer.findUnique({
      where: { id: producerId },
      include: {
        harvests: { where: { producerId, status: HarvestStatus.in_progress },
          include: {
            plantings: {
              include: {
                areas: true,
              },
            },
          },
        },
      },
    });
    if (!producer) {
      return 0;
    }
    const  allAreas = producer.harvests.flatMap((harvest) =>
      harvest.plantings.flatMap((planting) => planting.areas),
    );
    const uniqueAreas = Array.from(
      new Map(allAreas.map((area) => [area.id, area])).values(),
    );

    const totalAreaDecimal = uniqueAreas.reduce(
          (sum, area) => sum.plus(area.areaM2),
          new Decimal(0),
        );

    //convert Decimal to Hectares
    const totalAreaHectares = totalAreaDecimal.dividedBy(10000);
    //round to 1 decimal place
    return totalAreaHectares.toDecimalPlaces(1).toNumber();
  }
  
  async getUniqueInProgressProductsCount(producerId: number): Promise<number> {
  const plantings = await this.prisma.planting.findMany({
    where: {
      harvest: {
        producerId,
        status: HarvestStatus.in_progress,
      },
    },
    select: { productId: true },
  });

  const uniqueProductIds = new Set(plantings.map(p => p.productId));
  return uniqueProductIds.size;
}

  async getExpectedYield(producerId: number): Promise<number> {
    const result = await this.prisma.harvest.aggregate({
      where: {producerId, status: HarvestStatus.in_progress},
      _sum: {expectedYield: true},
    });
    return result._sum.expectedYield ?? 0;  
  }

  async getActiveHarvests(producerId: number) {
    const result = await this.prisma.harvest.findMany({
      where: {
        producerId,
        status: HarvestStatus.in_progress,
      },
      include: {
        plantings: {
          include: {
            areas: true,
          },
        },
      }
    });
    return result;
  }
}