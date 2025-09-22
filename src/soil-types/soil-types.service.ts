import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SoilTypesDto } from './dto/soil-types.dto';
import { SoilTypesRepository } from './soil-types.repository';
import { SoilTypes } from './entities/soil-types.entity';
import { UpdateSoilTypeDto } from './update-soil-type.dto';
import { AreasRepository } from 'src/areas/areas.repository';

@Injectable()
export class SoilTypesService {
  constructor(
    private readonly repository: SoilTypesRepository,
    private readonly areasRepository: AreasRepository,
  ) { }

  async create(soilTypesDto: SoilTypesDto): Promise<SoilTypes> {
    const data = {
      ...soilTypesDto,
      description: soilTypesDto.description ?? undefined,
    };
    return await this.repository.create(data);
  }

  async findAll(): Promise<SoilTypes[]> {
    return await this.repository.findAll();
  }

  async findById(id: number): Promise<SoilTypes> {
    const soilType = await this.repository.findById(id);
    if (!soilType) {
      throw new NotFoundException(
        `Tipo de solo com o ID ${id} não encontrado.`,
      );
    }
    return soilType;
  }
  async update(id: number, updateSoilTypeDto: UpdateSoilTypeDto): Promise<SoilTypes> {
    await this.findById(id);
    return await this.repository.update(id, updateSoilTypeDto);
  }

  async remove(id: number) {
    const soilType = await this.repository.findById(id);
    if (!soilType) {
      throw new NotFoundException(`Tipo de solo com o ID #${id} não encontrado.`);
    }

    const areaInUse = await this.areasRepository.existsBySoilTypeId(id);
    if (areaInUse) {
      throw new BadRequestException('Não é possível remover! tipo de solo está em uso por uma ou mais áreas.');
    }

    return this.repository.remove(id);
  }
}
