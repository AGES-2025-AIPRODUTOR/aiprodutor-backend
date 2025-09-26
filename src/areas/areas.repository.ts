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
  areaM2: number;
  soilTypeName: string;
  irrigationTypeName: string;
}

export interface AreaFromRepository {
  id: number;
  name: string;
  isActive: boolean;
  producerId: number;
  soilTypeId: number;
  irrigationTypeId: number;
  createdAt: Date;
  updatedAt: Date;
  polygon: Record<string, any> | null;
  areaM2: number;
  soilType: { id: number; name: string } | null;
  irrigationType: { id: number; name: string } | null;
}

@Injectable()
export class AreasRepository {
  constructor(private readonly prisma: PrismaService) {}

  async existsByIrrigationTypeId(id: number): Promise<boolean> {
    const count = await this.prisma.area.count({
      where: {
        irrigationTypeId: id,
      },
    });
    return count > 0;
  }

  async existsBySoilTypeId(id: number): Promise<boolean> {
    const count = await this.prisma.area.count({
      where: {
        soilTypeId: id,
      },
    });
    return count > 0;
  }

  private mapRawAreaToAreaWithRelations(
    row: RawAreaQueryResult,
  ): AreaFromRepository {
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
      areaM2: row.areaM2,
    };
  }

  async create(areaRequestDto: AreaRequestDto): Promise<any> {
    const { name, producerId, soilTypeId, irrigationTypeId, polygon, areaM2 } =
      areaRequestDto;
    const geojsonString = JSON.stringify(polygon);

    const result = await this.prisma.$queryRawUnsafe(
      `
      WITH new_area AS (
        INSERT INTO areas
          (name, polygon, "areaM2", "isActive", "producerId", "soilTypeId", "irrigationTypeId", "createdAt", "updatedAt")
        VALUES
          ($1, ST_GeomFromGeoJSON($2), $3, true, $4, $5, $6, NOW(), NOW())
        RETURNING id, name, "areaM2", "isActive", "producerId", "soilTypeId", "irrigationTypeId", "createdAt", "updatedAt", polygon
      )
      SELECT 
        na.id, na.name, na."areaM2", na."isActive", na."producerId", na."soilTypeId", na."irrigationTypeId", 
        na."createdAt", na."updatedAt", ST_AsGeoJSON(na.polygon) AS polygon,
        st.name as "soilTypeName",
        it.name as "irrigationTypeName"
      FROM new_area na
      LEFT JOIN soil_types st ON na."soilTypeId" = st.id
      LEFT JOIN irrigation_types it ON na."irrigationTypeId" = it.id;
      `,
      name,
      geojsonString,
      areaM2,
      producerId,
      soilTypeId,
      irrigationTypeId,
    );

    const row = (Array.isArray(result) ? result[0] : result) as any;
    return this.mapRawAreaToAreaWithRelations(row);
  }

  async findById(id: number): Promise<AreaFromRepository | null> {
    const result = await this.prisma.$queryRawUnsafe(
      `
      SELECT 
        a.id, a.name, a."areaM2", a."isActive", a."producerId", a."soilTypeId", a."irrigationTypeId", 
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

  async findByProducerId(producerId: number): Promise<AreaFromRepository[]> {
    const result = await this.prisma.$queryRawUnsafe(
      `
      SELECT 
        a.id, a.name, a."areaM2", a."isActive", a."producerId", a."soilTypeId", a."irrigationTypeId", 
        a."createdAt", a."updatedAt", ST_AsGeoJSON(a.polygon) AS polygon,
        st.name as "soilTypeName",
        it.name as "irrigationTypeName"
      FROM areas a
      LEFT JOIN soil_types st ON a."soilTypeId" = st.id
      LEFT JOIN irrigation_types it ON a."irrigationTypeId" = it.id
      WHERE a."producerId" = $1 AND a."isActive" = true
      ORDER BY a."createdAt" DESC
      `,
      producerId,
    );

    const rows = result as RawAreaQueryResult[];
    return rows.map((row) => this.mapRawAreaToAreaWithRelations(row));
  }

  async updateStatus(id: number, isActive: boolean): Promise<AreaFromRepository | null> {
    await this.prisma.area.update({
      where: { id },
      data: { isActive: isActive, updatedAt: new Date() },
    });

    return this.findById(id);
  }

  async update(id: number, dto: any): Promise<AreaFromRepository | null> {
    const dataToUpdate: {
      name?: string;
      isActive?: boolean;
      soilTypeId?: number;
      irrigationTypeId?: number;
      areaM2?: number;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (dto.name !== undefined) {
      dataToUpdate.name = dto.name;
    }
    if (dto.isActive !== undefined) {
      dataToUpdate.isActive = dto.isActive;
    }
    if (dto.soilTypeId !== undefined) {
      dataToUpdate.soilTypeId = dto.soilTypeId;
    }
    if (dto.irrigationTypeId !== undefined) {
      dataToUpdate.irrigationTypeId = dto.irrigationTypeId;
    }
    if (dto.areaM2 !== undefined) {
      dataToUpdate.areaM2 = dto.areaM2;
    }

    await this.prisma.area.update({
      where: { id },
      data: dataToUpdate,
    });

    return this.findById(id);
  }

  async findAll(): Promise<AreaFromRepository[]> {
    const result = await this.prisma.$queryRawUnsafe(
      `
      SELECT 
        a.id, a.name, a."areaM2", a."isActive", a."producerId", a."soilTypeId", a."irrigationTypeId", 
        a."createdAt", a."updatedAt", ST_AsGeoJSON(a.polygon) AS polygon,
        st.name as "soilTypeName",
        it.name as "irrigationTypeName"
      FROM areas a
      LEFT JOIN soil_types st ON a."soilTypeId" = st.id
      LEFT JOIN irrigation_types it ON a."irrigationTypeId" = it.id
      WHERE a."isActive" = true
      ORDER BY a."createdAt" DESC
      `,
    );

    const rows = result as RawAreaQueryResult[];
    return rows.map((row) => this.mapRawAreaToAreaWithRelations(row));
  }
}