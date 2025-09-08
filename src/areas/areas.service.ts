import { Injectable, NotFoundException } from '@nestjs/common';
import { AreasRepository } from './areas.repository';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { UpdateAreaStatusDto } from './dto/update-area-status.dto';

// Importa os SERVIÇOS dos outros módulos
import { ProducersService } from '../producers/producers.service';
import { SoilTypesService } from '../soil-types/soil-types.service';
import { IrrigationTypesService } from '../irrigation-types/irrigation-types.service';
import { Area } from '@prisma/client';

@Injectable()
export class AreasService {
  constructor(
    private readonly repository: AreasRepository,
    private readonly producersService: ProducersService,
    private readonly soilTypesService: SoilTypesService,
    private readonly irrigationTypesService: IrrigationTypesService,
  ) {}

  async create(createAreaDto: CreateAreaDto): Promise<Area> {
    const { producerId, soilTypeId, irrigationTypeId } = createAreaDto;

    await this.producersService.findOne(producerId);
    await this.soilTypesService.findById(soilTypeId);
    await this.irrigationTypesService.findById(irrigationTypeId);

    return this.repository.create(createAreaDto);
  }

  async updateStatus(id: number, dto: UpdateAreaStatusDto): Promise<Area> {
    const area = await this.repository.findById(id);
    if (!area) {
      throw new NotFoundException('Área não encontrada');
    }

    const isActiveCurrent = area.isActive === true;
    if (isActiveCurrent === dto.isActive) {
      return area;
    }

    return this.repository.updateStatus(id, dto.isActive);
  }

  async update(id: number, dto: UpdateAreaDto): Promise<Area> {
    await this.findOne(id); // Reutiliza o método findOne para verificar a existência
    return this.repository.update(id, dto);
  }

  async findOne(id: number): Promise<Area> {
    const area = await this.repository.findById(id);
    if (!area) {
      throw new NotFoundException(`Área com o ID ${id} não encontrada.`);
    }
    return area;
  }

  async findByProducerId(producerId: number): Promise<Area[]> {
    // Primeiro, verifica se o produtor existe para dar uma mensagem de erro clara
    await this.producersService.findOne(producerId);
    
    const areas = await this.repository.findByProducerId(producerId);
    
    // A verificação de 'areas.length === 0' pode ser feita no controller se necessário
    return areas;
  }

  async findAll(): Promise<Area[]> {
    return this.repository.findAll();
  }
}