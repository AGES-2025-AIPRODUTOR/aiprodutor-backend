import { Injectable, NotFoundException } from '@nestjs/common';
import { AreasRepository } from './areas.repository';
import { AreaRequestDto } from './dto/area-request.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { UpdateAreaStatusDto } from './dto/update-area-status.dto';
import { AreaResponseDto } from './dto/area-response.dto';
import { ProducersService } from '../producers/producers.service';
import { SoilTypesService } from '../soil-types/soil-types.service';
import { IrrigationTypesService } from '../irrigation-types/irrigation-types.service';
import { Area } from './entities/area.entity';

@Injectable()
export class AreasService {
  constructor(
    private readonly repository: AreasRepository,
    private readonly producersService: ProducersService,
    private readonly soilTypesService: SoilTypesService,
    private readonly irrigationTypesService: IrrigationTypesService,
  ) {}

private mapToArea(rawArea: any): Area {
  // Se o polígono for nulo, trate isso como um erro, pois sua lógica exige que ele exista.
  if (rawArea.polygon === null || rawArea.polygon === undefined) {
    throw new NotFoundException('O polígono para esta área não foi encontrado.');
  }

  return new Area({
    id: rawArea.id,
    name: rawArea.name,
    isActive: rawArea.isActive ?? true,
    producerId: rawArea.producerId,
    soilTypeId: rawArea.soilTypeId,
    irrigationTypeId: rawArea.irrigationTypeId,
    createdAt: rawArea.createdAt,
    updatedAt: rawArea.updatedAt,
    polygon: rawArea.polygon,
  });
}

  async create(areaRequestDto: AreaRequestDto): Promise<Area> {
    const { producerId, soilTypeId, irrigationTypeId } = areaRequestDto;

    await this.producersService.findOne(producerId);
    await this.soilTypesService.findById(soilTypeId);
    await this.irrigationTypesService.findById(irrigationTypeId);

    return this.repository.create(areaRequestDto);
  }

  async updateStatus(id: number, dto: UpdateAreaStatusDto): Promise<Area> {
    const area = await this.repository.findById(id);
    if (!area) {
      throw new NotFoundException('Área não encontrada');
    }

    const isActiveCurrent = area.isActive === true;
    if (isActiveCurrent === dto.isActive) {
      return this.mapToArea(area);
    }

    const updatedArea = await this.repository.updateStatus(id, dto.isActive);
    return this.mapToArea(updatedArea);
  }

  async update(id: number, dto: UpdateAreaDto): Promise<Area> {
    await this.findOne(id); // Reutiliza o método findOne para verificar a existência
    const updatedArea = await this.repository.update(id, dto);
    return this.mapToArea(updatedArea);
  }

  async findOne(id: number): Promise<Area> {
    const area = await this.repository.findById(id);
    if (!area) {
      throw new NotFoundException(`Área com o ID ${id} não encontrada.`);
    }
    return this.mapToArea(area);
  }

  async findByProducerId(producerId: number): Promise<Area[]> {
    // Primeiro, verifica se o produtor existe para dar uma mensagem de erro clara
    await this.producersService.findOne(producerId);
    
    const areas = await this.repository.findByProducerId(producerId);
    
    // A verificação de 'areas.length === 0' pode ser feita no controller se necessário
    return areas.map(area => this.mapToArea(area));
  }

  async findAll(): Promise<Area[]> {
    const areas = await this.repository.findAll();
    return areas.map(area => this.mapToArea(area));
  }
}