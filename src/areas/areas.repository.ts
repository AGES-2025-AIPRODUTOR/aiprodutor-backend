import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { AreaRequestDto } from './dto/area-request.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

interface RawAreaQueryResult {
  id: number;
  name: string;
  color: string;
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

interface AreaWithRelations {
  id: number;
  name: string;
  color: string;
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

  private mapRawAreaToAreaWithRelations(
    row: RawAreaQueryResult,
  ): AreaWithRelations {
    return {
      id: row.id,
      name: row.name,
      color: row.color,
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
      areaM2: Number(row.areaM2),
    };
  }

  async create(areaRequestDto: AreaRequestDto): Promise<AreaWithRelations> {
    const {
      name,
      producerId,
      soilTypeId,
      irrigationTypeId,
      polygon,
      color,
      areaM2,
    } = areaRequestDto;
    const geojsonString = JSON.stringify(polygon);

    const result = await this.prisma.$queryRaw<RawAreaQueryResult[]>`
      WITH new_area AS (
        INSERT INTO "areas" (name, color, polygon, "areaM2", "isActive", "producerId", "soilTypeId", "irrigationTypeId", "createdAt", "updatedAt")
        VALUES (
          ${name}, 
          ${color}, 
          ST_GeomFromGeoJSON(${geojsonString}), 
          ${areaM2},
          true, 
          ${producerId}, 
          ${soilTypeId}, 
          ${irrigationTypeId}, 
          NOW(), 
          NOW()
        )
        RETURNING id, name, color, "isActive", "producerId", "soilTypeId", "irrigationTypeId", "createdAt", "updatedAt", polygon, "areaM2"
      )
      SELECT 
        na.id, na.name, na.color, na."isActive", na."producerId", na."soilTypeId", na."irrigationTypeId", 
        na."createdAt", na."updatedAt", ST_AsGeoJSON(na.polygon) AS polygon, na."areaM2",
        st.name as "soilTypeName",
        it.name as "irrigationTypeName"
      FROM new_area na
      LEFT JOIN soil_types st ON na."soilTypeId" = st.id
      LEFT JOIN irrigation_types it ON na."irrigationTypeId" = it.id;
    `;

    return this.mapRawAreaToAreaWithRelations(result[0]);
  }

  async findById(id: number): Promise<AreaWithRelations | null> {
    const result = await this.prisma.$queryRaw<RawAreaQueryResult[]>`
      SELECT 
        a.id, a.name, a.color, a."isActive", a."producerId", a."soilTypeId", a."irrigationTypeId", 
        a."createdAt", a."updatedAt", ST_AsGeoJSON(a.polygon) AS polygon,
        st.name as "soilTypeName",
        it.name as "irrigationTypeName",
        a."areaM2"
      FROM areas a
      LEFT JOIN soil_types st ON a."soilTypeId" = st.id
      LEFT JOIN irrigation_types it ON a."irrigationTypeId" = it.id
      WHERE a.id = ${id}
    `;

    if (!result || result.length === 0) {
      return null;
    }

    return this.mapRawAreaToAreaWithRelations(result[0]);
  }

  async findByProducerId(producerId: number): Promise<AreaWithRelations[]> {
    const result = await this.prisma.$queryRaw<RawAreaQueryResult[]>`
      SELECT 
        a.id, a.name, a.color, a."isActive", a."producerId", a."soilTypeId", a."irrigationTypeId", 
        a."createdAt", a."updatedAt", ST_AsGeoJSON(a.polygon) AS polygon,
        st.name as "soilTypeName",
        it.name as "irrigationTypeName",
        a."areaM2"
      FROM areas a
      LEFT JOIN soil_types st ON a."soilTypeId" = st.id
      LEFT JOIN irrigation_types it ON a."irrigationTypeId" = it.id
      WHERE a."producerId" = ${producerId} AND a."isActive" = true
      ORDER BY a."createdAt" DESC
    `;

    return result.map((row) => this.mapRawAreaToAreaWithRelations(row));
  }

  async updateStatus(
    id: number,
    isActive: boolean,
  ): Promise<AreaWithRelations | null> {
    await this.prisma.area.update({
      where: { id },
      data: { isActive: isActive, updatedAt: new Date() },
    });
    return this.findById(id);
  }

  async update(
    id: number,
    dto: UpdateAreaDto,
  ): Promise<AreaWithRelations | null> {
    await this.prisma.area.update({
      where: { id },
      data: { ...dto, updatedAt: new Date() },
    });
    return this.findById(id);
  }

  async findAll(): Promise<AreaWithRelations[]> {
    const result = await this.prisma.$queryRaw<RawAreaQueryResult[]>`
      SELECT 
        a.id, a.name, a.color, a."isActive", a."producerId", a."soilTypeId", a."irrigationTypeId", 
        a."createdAt", a."updatedAt", ST_AsGeoJSON(a.polygon) AS polygon,
        st.name as "soilTypeName",
        it.name as "irrigationTypeName",
        a."areaM2"
      FROM areas a
      LEFT JOIN soil_types st ON a."soilTypeId" = st.id
      LEFT JOIN irrigation_types it ON a."irrigationTypeId" = it.id
      WHERE a."isActive" = true
      ORDER BY a."createdAt" DESC
    `;

    return result.map((row) => this.mapRawAreaToAreaWithRelations(row));
  }

  async existsBySoilTypeId(soilTypeId: number): Promise<boolean> {
    const area = await this.prisma.area.findFirst({ where: { soilTypeId } });
    return !!area;
  }

  async existsByIrrigationTypeId(irrigationTypeId: number): Promise<boolean> {
    const area = await this.prisma.area.findFirst({
      where: { irrigationTypeId },
    });
    return !!area;
  }
}
