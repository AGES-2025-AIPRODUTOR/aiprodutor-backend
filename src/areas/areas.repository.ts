import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { AreaRequestDto } from './dto/area-request.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

interface RawAreaResult {
  id: number;
  name: string;
  isActive: boolean;
  producerId: number;
  soilTypeId: number;
  irrigationTypeId: number;
  createdAt: string;
  polygon: string;
}

interface RawAreaQueryResult {
  id: number;
  name: string;
  isActive: boolean;
  producerId: number;
  soilTypeId: number;
  irrigationTypeId: number;
  createdAt: Date;
  updatedAt: Date;
  polygon: string;
  soilTypeName: string;
  irrigationTypeName: string;
}

interface AreaWithRelations {
  id: number;
  name: string;
  isActive: boolean;
  producerId: number;
  soilTypeId: number;
  irrigationTypeId: number;
  createdAt: Date;
  updatedAt: Date;
  polygon: Record<string, any> | null;
  soilType: { id: number; name: string } | null;
  irrigationType: { id: number; name: string } | null;
}

@Injectable()
export class AreasRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapRawAreaToAreaWithRelations(
    row: RawAreaQueryResult,
  ): AreaWithRelations {
    return {
      id: row.id,
      name: row.name,
      isActive: row.isActive,
      producerId: row.producerId,
      soilTypeId: row.soilTypeId,
      irrigationTypeId: row.irrigationTypeId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      polygon: row.polygon
        ? (JSON.parse(row.polygon) as Record<string, any>)
        : null,
      soilType: row.soilTypeName
        ? { id: row.soilTypeId, name: row.soilTypeName }
        : null,
      irrigationType: row.irrigationTypeName
        ? { id: row.irrigationTypeId, name: row.irrigationTypeName }
        : null,
    };
  }

  async create(areaRequestDto: AreaRequestDto): Promise<any> {
    const { name, producerId, soilTypeId, irrigationTypeId, polygon } =
      areaRequestDto;
    const geojsonString = JSON.stringify(polygon);

    const result = await this.prisma.$queryRawUnsafe(
      `
      INSERT INTO areas
        (name, polygon, "isActive", "producerId", "soilTypeId", "irrigationTypeId", "createdAt", "updatedAt")
      VALUES
        ($1, ST_GeomFromGeoJSON($2), $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, name, "isActive", "producerId", "soilTypeId", "irrigationTypeId", "createdAt", ST_AsGeoJSON(polygon) AS polygon;
      `,
      name,
      geojsonString,
      true,
      producerId,
      soilTypeId,
      irrigationTypeId,
    );

    const row = (Array.isArray(result) ? result[0] : result) as RawAreaResult;
    return {
      ...row,
      polygon:
        row && row.polygon
          ? (JSON.parse(row.polygon) as Record<string, any>)
          : undefined,
    };
  }

  async findById(id: number): Promise<AreaWithRelations | null> {
    const result = await this.prisma.$queryRawUnsafe(
      `
      SELECT 
        a.id, a.name, a."isActive", a."producerId", a."soilTypeId", a."irrigationTypeId", 
        a."createdAt", a."updatedAt", ST_AsGeoJSON(a.polygon) AS polygon,
        st.name as "soilTypeName",
        it.name as "irrigationTypeName"
      FROM areas a
      LEFT JOIN soil_types st ON a."soilTypeId" = st.id
      LEFT JOIN irrigation_types it ON a."irrigationTypeId" = it.id
      WHERE a.id = $1
      `,
      id,
    );

    const rows = result as RawAreaQueryResult[];

    if (!rows || rows.length === 0) {
      return null;
    }

    return this.mapRawAreaToAreaWithRelations(rows[0]);
  }

  async findByProducerId(producerId: number): Promise<AreaWithRelations[]> {
    const result = await this.prisma.$queryRawUnsafe(
      `
      SELECT 
        a.id, a.name, a."isActive", a."producerId", a."soilTypeId", a."irrigationTypeId", 
        a."createdAt", a."updatedAt", ST_AsGeoJSON(a.polygon) AS polygon,
        st.name as "soilTypeName",
        it.name as "irrigationTypeName"
      FROM areas a
      LEFT JOIN soil_types st ON a."soilTypeId" = st.id
      LEFT JOIN irrigation_types it ON a."irrigationTypeId" = it.id
      WHERE a."producerId" = $1
      ORDER BY a."createdAt" DESC
      `,
      producerId,
    );

    const rows = result as RawAreaQueryResult[];

    return rows.map((row) => this.mapRawAreaToAreaWithRelations(row));
  }

  async updateStatus(id: number, isActive: boolean): Promise<any> {
    return this.prisma.area.update({
      where: { id },
      data: { isActive: isActive, updatedAt: new Date() },
    });
  }

  async update(id: number, dto: UpdateAreaDto): Promise<any> {
    const mappedData: {
      name?: string;
      isActive?: boolean;
      soilTypeId?: number;
      irrigationTypeId?: number;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    // Somente adiciona os campos que estão definidos no DTO
    if (dto.name !== undefined) {
      mappedData.name = dto.name;
    }
    if (dto.isActive !== undefined) {
      mappedData.isActive = dto.isActive;
    }
    if (dto.soilTypeId !== undefined) {
      mappedData.soilTypeId = dto.soilTypeId;
    }
    if (dto.irrigationTypeId !== undefined) {
      mappedData.irrigationTypeId = dto.irrigationTypeId;
    }

    return this.prisma.area.update({
      where: { id },
      data: mappedData,
    });
  }
}
