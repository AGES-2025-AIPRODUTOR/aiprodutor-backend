import { Injectable, NotFoundException } from '@nestjs/common';
// CORREÇÃO 1: Removida a importação de 'AreaFromRepository' que não existe.
import { AreasRepository } from './areas.repository';
import { AreaRequestDto } from './dto/area-request.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { UpdateAreaStatusDto } from './dto/update-area-status.dto';
import { AreaResponseDto } from './dto/area-response.dto';
import { ProducersService } from '../producers/producers.service';
import { SoilTypesService } from '../soil-types/soil-types.service';
import { IrrigationTypesService } from '../irrigation-types/irrigation-types.service';

interface AreaFromRepository {
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
export class AreasService {
  constructor(
    private readonly repository: AreasRepository,
    private readonly producersService: ProducersService,
    private readonly soilTypesService: SoilTypesService,
    private readonly irrigationTypesService: IrrigationTypesService,
  ) {}

  private mapToResponseDto(areaData: AreaFromRepository): AreaResponseDto {
    const mappedData = {
      ...areaData,
      polygon: areaData.polygon ?? undefined,
      soilType: areaData.soilType ?? undefined,
      irrigationType: areaData.irrigationType ?? undefined,
      areaM2: areaData.areaM2,
    };
    return new AreaResponseDto(mappedData);
  }

  async create(areaRequestDto: AreaRequestDto): Promise<AreaResponseDto> {
    const { producerId, soilTypeId, irrigationTypeId } = areaRequestDto;

    await this.producersService.findOne(producerId);
    await this.soilTypesService.findById(soilTypeId);
    await this.irrigationTypesService.findById(irrigationTypeId);
    
    const fullNewArea = await this.repository.create(areaRequestDto);
    return this.mapToResponseDto(fullNewArea);
  }

  async updateStatus(
    id: number,
    dto: UpdateAreaStatusDto,
  ): Promise<AreaResponseDto> {
    const area = await this.repository.findById(id);
    if (!area) {
      throw new NotFoundException(`Área com o ID ${id} não encontrada.`);
    }

    if (area.isActive === dto.isActive) {
      return this.mapToResponseDto(area);
    }

    const updatedArea = await this.repository.updateStatus(id, dto.isActive);
    return this.mapToResponseDto(updatedArea!);
  }

  async update(id: number, dto: UpdateAreaDto): Promise<AreaResponseDto> {
    const areaExists = await this.repository.findById(id);
    if (!areaExists) {
      throw new NotFoundException(`Área com o ID ${id} não encontrada.`);
    }
    
    const updatedArea = await this.repository.update(id, dto);
    return this.mapToResponseDto(updatedArea!);
  }

  async findOne(id: number): Promise<AreaResponseDto> {
    const area = await this.repository.findById(id);
    if (!area) {
      throw new NotFoundException(`Área com o ID ${id} não encontrada.`);
    }
    return this.mapToResponseDto(area);
  }

  async findByProducerId(producerId: number): Promise<AreaResponseDto[]> {
    await this.producersService.findOne(producerId);

    const areas = await this.repository.findByProducerId(producerId);
    return areas.map((area) => this.mapToResponseDto(area));
  }

  async findAll(): Promise<AreaResponseDto[]> {
    const areas = await this.repository.findAll();
    return areas.map((area) => this.mapToResponseDto(area));
  }
}