import { Injectable, NotFoundException } from '@nestjs/common';
import { SoilTypesDto } from './dto/soil-types.dto';
import { SoilTypesRepository } from './soil-types.repository';
import { SoilTypes } from './entities/soil-types.entity';
import { UpdateSoilTypeDto } from './update-soil-type.dto';

@Injectable()
export class SoilTypesService {
  constructor(private readonly repository: SoilTypesRepository) { }

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
    return this.repository.remove(id);
  }
}
