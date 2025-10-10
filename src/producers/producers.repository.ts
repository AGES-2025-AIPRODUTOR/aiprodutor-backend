import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { Prisma } from '@prisma/client';

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
}
