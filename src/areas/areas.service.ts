/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { AreasRepository } from './areas.repository';
import { ProducersRepository } from '../producers/producers.repository';
import { SoilTypesRepository } from '../soil-types/soil-types.repository';
import { IrrigationTypesRepository } from '../irrigation-types/irrigation-types.repository';
import { AreaRequestDto } from './dto/area-request.dto';

@Injectable()
export class AreasService {
  constructor(
    private readonly repository: AreasRepository,
    private readonly producersRepository: ProducersRepository,
    private readonly soilTypesRepository: SoilTypesRepository,
    private readonly irrigationTypesRepository: IrrigationTypesRepository,
  ) {}

  async create(areaRequestDto: AreaRequestDto): Promise<any> {
    const { name, producerId, soilTypeId, irrigationTypeId, polygon } = areaRequestDto;
    // Verifica se o produtor existe
    const producer = await this.producersRepository.findById(producerId);
    if (!producer) {
      throw new NotFoundException('Produtor não encontrado');
    }
    // Verifica se o tipo de solo existe
    const soilType = await this.soilTypesRepository.findById(soilTypeId);
    if (!soilType) {
      throw new NotFoundException('Tipo de solo não encontrado');
    }
    // Verifica se o tipo de irrigação existe
    const irrigationType = await this.irrigationTypesRepository.findById(irrigationTypeId);
    if (!irrigationType) {
      throw new NotFoundException('Tipo de irrigação não encontrado');
    }

    return this.repository.create(areaRequestDto);
  }
}
