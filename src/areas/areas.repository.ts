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
  areaSize: number;

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
  areaSize: number; // Adicione este campo
  soilType: { id: number; name: string } | null;
  irrigationType: { id: number; name: string } | null;
}

@Injectable()
export class AreasRepository {
  constructor(private readonly prisma: PrismaService) { }

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
      areaSize: row.areaSize,
    };
  }

  async create(areaRequestDto: AreaRequestDto): Promise<any> {
    const { name, producerId, soilTypeId, irrigationTypeId, polygon, color } =
      areaRequestDto;
    const geojsonString = JSON.stringify(polygon);

    const result = await this.prisma.$queryRawUnsafe<any[]>(
      `
      WITH new_area AS (
        INSERT INTO areas
          (name, polygon, color, "isActive", "producerId", "soilTypeId", "irrigationTypeId", "createdAt", "updatedAt")
        VALUES
          ($1, ST_GeomFromGeoJSON($2), $3, true, $4, $5, $6, NOW(), NOW())
        RETURNING id, name, "isActive", "producerId", "soilTypeId", "irrigationTypeId", "createdAt", "updatedAt", polygon, color
      )
      SELECT 
        na.id, na.name, na."isActive", na."producerId", na."soilTypeId", na."irrigationTypeId", 
        na."createdAt", na."updatedAt", ST_AsGeoJSON(na.polygon) AS polygon, na.color,
        st.name as "soilTypeName",
        it.name as "irrigationTypeName",
        ST_Area(na.polygon::geography) as "areaSize"
      FROM new_area na
      LEFT JOIN soil_types st ON na."soilTypeId" = st.id
      LEFT JOIN irrigation_types it ON na."irrigationTypeId" = it.id;
      `,
      name,
      geojsonString,
      color,
      producerId,
      soilTypeId,
      irrigationTypeId,
    );
    
    const row = (Array.isArray(result) ? result[0] : result);
    return this.mapRawAreaToAreaWithRelations(row);
  }


  async findById(id: number): Promise<AreaWithRelations | null> {
    const result = await this.prisma.$queryRawUnsafe(
      `
      SELECT 
        a.id, a.name, a."isActive", a."producerId", a."soilTypeId", a."irrigationTypeId", 
        a."createdAt", a."updatedAt", ST_AsGeoJSON(a.polygon) AS polygon,
        st.name as "soilTypeName",
        it.name as "irrigationTypeName",
        ST_Area(a.polygon::geography) as "areaSize" -- ADICIONE ESTA LINHA
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
        it.name as "irrigationTypeName",
        ST_Area(a.polygon::geography) as "areaSize" -- ADICIONE ESTA LINHA
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

  async updateStatus(id: number, isActive: boolean): Promise<AreaWithRelations | null> {
    await this.prisma.area.update({
      where: { id },
      data: { isActive: isActive, updatedAt: new Date() },
    });

    return this.findById(id);
  }

  async update(id: number, dto: UpdateAreaDto): Promise<AreaWithRelations | null> {
    const mappedData: {
      name?: string;
      isActive?: boolean;
      soilTypeId?: number;
      irrigationTypeId?: number;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

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

    await this.prisma.area.update({
      where: { id },
      data: mappedData,
    });

    return this.findById(id);
  }

  async findAll(): Promise<AreaWithRelations[]> {
    const result = await this.prisma.$queryRawUnsafe(
      `
      SELECT 
        a.id, a.name, a."isActive", a."producerId", a."soilTypeId", a."irrigationTypeId", 
        a."createdAt", a."updatedAt", ST_AsGeoJSON(a.polygon) AS polygon,
        st.name as "soilTypeName",
        it.name as "irrigationTypeName",
        ST_Area(a.polygon::geography) as "areaSize" -- ADICIONE ESTA LINHA
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

  async existsBySoilTypeId(soilTypeId: number): Promise<boolean> {
    const area = await this.prisma.area.findFirst({ where: { soilTypeId } });
    return !!area;
  }

  async existsByIrrigationTypeId(irrigationTypeId: number): Promise<boolean> {
    const area = await this.prisma.area.findFirst({ where: { irrigationTypeId } });
    return !!area;
  }
}
