import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IrrigationTypesDto } from './dto/irrigation-types.dto';
import { IrrigationTypesRepository } from './irrigation-types.repository';
import { IrrigationTypes } from './entities/irrigation-types.entity';
import { UpdateIrrigationTypeDto } from './update-irrigation-type.dto';
import { AreasRepository } from 'src/areas/areas.repository';

@Injectable()
export class IrrigationTypesService {
  constructor(
    private readonly repository: IrrigationTypesRepository,
    private readonly areasRepository: AreasRepository
  ) { }

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

  async update(id: number, updateIrrigationTypeDto: UpdateIrrigationTypeDto): Promise<IrrigationTypes> {
    // Garante que o registro existe antes de tentar atualizar
    await this.findById(id);

    // Executa a atualização
    return await this.repository.update(id, updateIrrigationTypeDto);
  }

  async remove(id: number) {
    const irrigationType = await this.repository.findById(id);
    if (!irrigationType) {
      throw new NotFoundException(`Tipo de irrigação com o ID #${id} não encontrado.`);
    }

    const irrigationTypeInUse = await this.areasRepository.existsByIrrigationTypeId(id);
    if (irrigationTypeInUse) {
      throw new BadRequestException('Não é possível remover! tipo de irrigação está em uso por uma ou mais áreas.');
    }

    return this.repository.remove(id);
  }
}
