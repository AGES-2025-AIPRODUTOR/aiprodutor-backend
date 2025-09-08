import { Injectable } from '@nestjs/common';
import { IrrigationTypesDto } from './dto/irrigation-types.dto';
import { IrrigationTypesRepository } from './irrigation-types.repository';
import { IrrigationTypes } from './entities/irrigation-types.entity';

@Injectable()
export class IrrigationTypesService {
  constructor(private readonly repository: IrrigationTypesRepository) {}

  async create(
    irrigationTypesDto: IrrigationTypesDto,
  ): Promise<IrrigationTypes> {
    const data = {
      ...irrigationTypesDto,
      description: irrigationTypesDto.description ?? undefined,
    };
    return await this.repository.create(data);
  }
}
