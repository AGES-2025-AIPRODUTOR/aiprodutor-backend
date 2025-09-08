import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(): Promise<IrrigationTypes[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<IrrigationTypes> {
    const irrigationType = await this.repository.findById(id);
    if (!irrigationType) {
      throw new NotFoundException(
        `Tipo de irrigação com o ID ${id} não encontrado.`,
      );
    }
    return irrigationType;
  }
}
