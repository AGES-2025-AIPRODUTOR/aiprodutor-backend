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
      // query segura contra SQL Injection
      return this.prisma.$queryRaw(Prisma.sql`
        SELECT
          a.name AS "areaName",
          a."isActive" AS "areaStatus",
          -- Calcula a área em metros quadrados e converte para hectares (1 ha = 10.000 m²)
          ST_Area(a.polygon::geography) / 10000 AS "areaM2",
          p.name AS "plantingName",
          p."plantingDate",
          p."quantityPlanted",
          p."quantityHarvested",
          v.name AS "varietyName",
          h.name AS "safraName",
          h."endDate" AS "harvestDate"
        FROM "public"."plantings" AS p
        -- JOIN obrigatório para filtrar pelo produtor
        INNER JOIN "public"."areas" AS a ON p."areaId" = a.id
        -- LEFT JOIN para dados que podem não existir (ex: um plantio sem safra ainda)
        LEFT JOIN "public"."varieties" AS v ON p."varietyId" = v.id
        LEFT JOIN "public"."harvests" AS h ON p."harvestId" = h.id
        WHERE a."producerId" = ${producerId}
        ORDER BY p."plantingDate" DESC;
      `);
    }
}
