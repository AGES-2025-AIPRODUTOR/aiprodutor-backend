/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { AreaRequestDto } from './dto/area-request.dto';

@Injectable()
export class AreasRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(areaRequestDto: AreaRequestDto): Promise<any> {
    const { name, producerId, soilTypeId, irrigationTypeId, polygon } = areaRequestDto;
    const geojsonString = JSON.stringify(polygon);

    const result = await this.prisma.$queryRawUnsafe(
      `
      INSERT INTO areas
        (name, polygon, ativo, "producerId", "soilTypeId", "irrigationTypeId", "createdAt", "updatedAt")
      VALUES
        ($1, ST_GeomFromGeoJSON($2), $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, name, ativo, "producerId", "soilTypeId", "irrigationTypeId", "createdAt", ST_AsGeoJSON(polygon) AS polygon;
      `,
      name,
      geojsonString,
      true,
      producerId,
      soilTypeId,
      irrigationTypeId
    );
    const row = Array.isArray(result) ? result[0] : result;
    return {
      ...row,
      polygon: row && row.polygon ? JSON.parse(row.polygon) : undefined,
    };
  }

  async findById(id: number): Promise<any | null> {
    return this.prisma.area.findUnique({ where: { id } });
  }

  async updateStatus(id: number, ativo: boolean): Promise<any> {
    return this.prisma.area.update({
      where: { id },
      data: { ativo: ativo, updatedAt: new Date() },
    });
  }
}
