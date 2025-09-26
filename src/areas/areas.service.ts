import { Injectable, NotFoundException } from '@nestjs/common';
import { AreasRepository, AreaFromRepository } from './areas.repository';
import { AreaRequestDto } from './dto/area-request.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { UpdateAreaStatusDto } from './dto/update-area-status.dto';
import { AreaResponseDto } from './dto/area-response.dto';
import { ProducersService } from '../producers/producers.service';
import { SoilTypesService } from '../soil-types/soil-types.service';
import { IrrigationTypesService } from '../irrigation-types/irrigation-types.service';
import { Decimal } from '@prisma/client/runtime/library';

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
      areaM2: areaData.areaM2,
      polygon: areaData.polygon ?? undefined,
      soilType: areaData.soilType ?? undefined,
      irrigationType: areaData.irrigationType ?? undefined,
    };
    return new AreaResponseDto(mappedData);
  }

  async create(areaRequestDto: AreaRequestDto): Promise<AreaResponseDto> {
    const { producerId, soilTypeId, irrigationTypeId, areaM2 } = areaRequestDto;

    await this.producersService.findOne(producerId);
    await this.soilTypesService.findById(soilTypeId);
    await this.irrigationTypesService.findById(irrigationTypeId);

    const fullNewArea = await this.repository.create({
      ...areaRequestDto,
      areaM2: areaM2, // Alterado: Usamos o 'areaM2' como 'number'
    });
    return this.mapToResponseDto(fullNewArea!);
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

    const dataToUpdate: any = { ...dto };
    if (dto.areaM2 !== undefined) {
      dataToUpdate.areaM2 = new Decimal(dto.areaM2);
    }

    const updatedArea = await this.repository.update(id, dataToUpdate);
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