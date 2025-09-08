import { Injectable } from '@nestjs/common';
import { SoilTypesDto } from './dto/soil-types.dto';
import { SoilTypesRepository } from './soil-types.repository';
import { SoilTypes } from './entities/soil-types.entity';

@Injectable()
export class SoilTypesService {
  constructor(private readonly repository: SoilTypesRepository) {}

  async create(soilTypesDto: SoilTypesDto): Promise<SoilTypes> {
    const data = {
      ...soilTypesDto,
      description: soilTypesDto.description ?? undefined,
    };
    return await this.repository.create(data);
  }
}
