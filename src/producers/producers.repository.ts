import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { Prisma } from '@prisma/client';
import { HarvestsRepository } from '../harvests/harvests.repository';

@Injectable()
export class ProducersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly harvestsRepository: HarvestsRepository,
  ) {}

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

  async calculateCropDistribution(producerId: number) {
    // Busca todas as safras em andamento com plantios, produtos e áreas
    const harvests =
      await this.harvestsRepository.findInProgressByProducer(producerId);

    // Juntas todos os plantios de todas as safras
    const plantings = harvests.flatMap((h) => h.plantings);

    if (plantings.length === 0) {
      return [];
    }

    // Soma de áreas por cultura
    const areaByCulture: Record<string, number> = {};

    for (const p of plantings) {
      // cultura vem do produto
      const culture = p.product.name;

      // Soma as áreas associadas ao plantio
      const totalAreaM2 = p.areas
        .map((a) => Number(a.areaM2))
        .reduce((sum, val) => sum + val, 0);

      const areaHa = totalAreaM2 / 10000; // converter m² para hectares

      areaByCulture[culture] = (areaByCulture[culture] || 0) + areaHa;
    }

    // Total área em m2
    const totalArea = Object.values(areaByCulture).reduce((a, b) => a + b, 0);

    // Calcular percentuais de cada cultura
    const distribution = Object.entries(areaByCulture).map(
      ([culture, area]) => ({
        cultura: culture,
        percentual: Number(((area / totalArea) * 100).toFixed(1)),
      }),
    );

    // Ordenar do maior ao menor os percentuais
    distribution.sort((a, b) => b.percentual - a.percentual);
    return distribution;
  }
}
