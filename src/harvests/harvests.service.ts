import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { HarvestsRepository } from './harvests.repository';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { HarvestEntity } from './entities/harvest.entity';
import { HarvestPanelResponseDto } from './dto/harvest-panel.dto';

@Injectable()
export class HarvestsService {
  constructor(private readonly repository: HarvestsRepository) {}

  async create(createHarvestDto: CreateHarvestDto): Promise<HarvestEntity> {
    const newHarvest = await this.repository.create(createHarvestDto);
    const harvestWithEmptyPlantings = {
      ...newHarvest,
      plantings: [], 
    };
    
    return new HarvestEntity(harvestWithEmptyPlantings);
  }

  async findAll(): Promise<HarvestEntity[]> {
    const harvests = await this.repository.findAll();
    return harvests.map((harvest) => new HarvestEntity(harvest));
  }

  async findOne(id: number): Promise<HarvestEntity> {
    const harvest = await this.repository.findById(id);
    if (!harvest) {
      throw new NotFoundException(`Safra com o ID #${id} não encontrada.`);
    }
    return new HarvestEntity(harvest);
  }

  // Update está mais simples
  async update(id: number, updateHarvestDto: UpdateHarvestDto): Promise<HarvestEntity> {
    await this.findOne(id); // findOne já valida a existência
    const harvest = await this.repository.update(id, updateHarvestDto);
    return new HarvestEntity(harvest);
  }
  
  async remove(id: number): Promise<HarvestEntity> {
    const harvest = await this.findOne(id);
    if (harvest.plantings && harvest.plantings.length > 0) {
      throw new ConflictException(
        `Não é possível excluir esta safra, pois ela possui ${harvest.plantings.length} plantios associados.`,
      );
    }

    const removedHarvest = await this.repository.remove(id);
    return new HarvestEntity(removedHarvest);
  }

  async getHarvestPanel(id: number): Promise<HarvestPanelResponseDto> {
    const harvest = await this.repository.findById(id);

    if (!harvest) {
      throw new NotFoundException(`Safra com o ID #${id} não encontrada.`);
    }

    // Dados mock temporários
    const mockData = {
      area_count: 2,
      total_area: 7.5,
      cultivar: 'Tomate Cereja',
      expected_yield: 8000,
      linked_plantings: [
        {
          planting_name: 'Plantio de Tomate Mock',
          planting_area: 'Área Mock A',
          expected_yield: 5000,
          planting_date: harvest.startDate,
          estimated_harvest_date: harvest.endDate || new Date('2025-12-15'),
        },
      ],
    };

    return {
      generalInfo: {
        area_count: mockData.area_count,
        total_area: mockData.total_area,
        cultivar: mockData.cultivar,
        expected_yield: mockData.expected_yield,
        harvest_start_date: harvest.startDate,
        harvest_end_date: harvest.endDate,
        linked_plantings: mockData.linked_plantings,
      },
    };
  }
}
