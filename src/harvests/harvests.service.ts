import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { HarvestsRepository } from './harvests.repository';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { HarvestEntity } from './entities/harvest.entity';
import { HarvestPanelResponseDto } from './dto/harvest-panel.dto';
import { AreasService } from '../areas/areas.service';
import { ProducersService } from '../producers/producers.service'; // IMPORTAR
import { GetHarvestHistoryQueryDto } from './dto/get-harvest-history-query.dto';
import { HarvestHistoryResponseDto } from './dto/harvest-history-response.dto';
import { ProductsService } from '../products/products.service';
import { VarietiesService } from '../varieties/varieties.service';
import { InProgressHarvestDto  } from './dto/harvest-response.dto';
import { format } from 'date-fns';

@Injectable()
export class HarvestsService {
  constructor(
    private readonly repository: HarvestsRepository,
    private readonly areasService: AreasService,
    private readonly producersService: ProducersService,
    private readonly productsService: ProductsService,
    private readonly varietiesService: VarietiesService,
  ) {}
  private formatDate(date: Date | null | undefined): string | null {
    if (!date) {
      return null;
    }
    return format(new Date(date), 'dd-MM-yyyy');
  }
  async findHistoryByProducer(
    producerId: number,
    queryDto: GetHarvestHistoryQueryDto,
  ): Promise<HarvestHistoryResponseDto[]> {
    await this.producersService.findOne(producerId);

    const harvestsFromDb = await this.repository.findHistoryByProducer(
      producerId,
      queryDto,
    );

    return harvestsFromDb.map((harvest) => {
      return {
        safraId: harvest.id,
        safraName: harvest.name,
        safraInitialDate: harvest.startDate,
        safraEndDate: harvest.endDate,
        areas: harvest.areas.map(a => ({ id: a.id, name: a.name })),
        status: harvest.status,
        planting: harvest.plantings.map(p => ({
          id: p.id,
          initialDate: p.plantingDate,
          estimatedEndDate: p.expectedHarvestDate,
          qtyEstimated: `${p.quantityPlanted.toString()}kg`,
          areaName: p.areas.map(a => a.name),
        })),
      };
    });
  }

  async create(createHarvestDto: CreateHarvestDto): Promise<HarvestEntity> {
    const { areaIds, producerId, name, plantings } = createHarvestDto;

    // 1. Validação de nome duplicado
    const existingHarvest = await this.repository.findByName(name);
    if (existingHarvest) {
      throw new ConflictException(`Já existe uma safra com o nome "${name}".`);
    }

    // 2. Valida a existência do produtor e das áreas da safra
    await this.producersService.findOne(producerId);
    for (const areaId of areaIds) {
      await this.areasService.findOne(areaId);
    }

  
    if (plantings && plantings.length > 0) {
      for (const planting of plantings) {
        // 3a. Valida se a área do plantio está contida nas áreas da safra
        const isAreaValid = planting.areaIds.every(id => areaIds.includes(id));
        if (!isAreaValid) {
          throw new BadRequestException(`O plantio "${planting.name}" está sendo associado a uma área que não pertence à safra.`);
        }

        // 3b. Valida a existência do produto, variedade e áreas do plantio
        await this.productsService.findOne(planting.productId);
        await this.varietiesService.findOne(planting.varietyId);
        for (const areaId of planting.areaIds) {
            await this.areasService.findOne(areaId);
        }
      }
    }

    const newHarvest = await this.repository.create(createHarvestDto);
    return new HarvestEntity(newHarvest);
  }

  async findOne(id: number): Promise<HarvestEntity> {
    const harvest = await this.repository.findById(id);
    if (!harvest) {
      throw new NotFoundException(`Safra com o ID #${id} não encontrada.`);
    }
    return new HarvestEntity(harvest);
  }

  async findAll(): Promise<HarvestEntity[]> {
    const harvests = await this.repository.findAll();
    return harvests.map((harvest) => new HarvestEntity(harvest));
  }

  async update(id: number, updateHarvestDto: UpdateHarvestDto): Promise<HarvestEntity> {
    await this.findOne(id);

    if (updateHarvestDto.areaIds) {
      for (const areaId of updateHarvestDto.areaIds) {
        await this.areasService.findOne(areaId).catch(() => {
          throw new BadRequestException(`A área com ID #${areaId} para atualização não foi encontrada.`);
        });
      }
    }

    const harvest = await this.repository.update(id, updateHarvestDto);
    return new HarvestEntity(harvest);
  }

  async remove(id: number): Promise<HarvestEntity> {
    const harvest = await this.findOne(id);
    if (harvest.plantings && harvest.plantings.length > 0) {
      throw new ConflictException(`Não é possível excluir a safra, pois ela possui ${harvest.plantings.length} plantios associados.`);
    }
    const removedHarvest = await this.repository.remove(id);
    return new HarvestEntity(removedHarvest);
  }

  async findByProducerId(producerId: number): Promise<HarvestEntity[]> {
    await this.producersService.findOne(producerId);
    const harvests = await this.repository.findByProducerId(producerId);
    return harvests.map(h => new HarvestEntity(h));
  }

  async getHarvestPanel(id: number): Promise<HarvestPanelResponseDto> {
    const harvest = await this.repository.findById(id);
    if (!harvest) {
      throw new NotFoundException(`Safra com o ID #${id} não encontrada.`);
    }

    const totalAreaInMeters = harvest.areas.reduce(
      (sum, area) => sum + area.areaM2.toNumber(), 0
    );
    const totalAreaInHectares = parseFloat((totalAreaInMeters / 10000).toFixed(2));

    const linkedPlantings = harvest.plantings.map((p) => ({
      plantingName: p.name,
      plantingArea: p.areas.map(a => a.name).join(', '),
      expectedYield: p.expectedYield,
      
      // 2. APLICAR A FORMATAÇÃO
      plantingDate: this.formatDate(p.plantingDate)!, // Usamos '!' pois sabemos que plantingDate é obrigatório
      estimatedHarvestDate: this.formatDate(p.expectedHarvestDate),
    }));

    const cultivares = [...new Set(harvest.plantings.map(p => p.product.name))].join(', ');

    return {
      generalInfo: {
        areaCount: harvest.areas.length,
        totalArea: totalAreaInHectares,
        cultivar: cultivares || 'Nenhum',
        expectedYield: harvest.expectedYield,
        
        // 3. APLICAR A FORMATAÇÃO
        harvestStartDate: this.formatDate(harvest.startDate)!,
        harvestEndDate: this.formatDate(harvest.endDate),

        linkedPlantings: linkedPlantings,
      },
    };
  }

  async findInProgressByProducer(
    producerId: number,
  ): Promise<InProgressHarvestDto[]> {
    await this.producersService.findOne(producerId);

    const harvests = await this.repository.findInProgressByProducer(producerId);

    return harvests.map((harvest) => ({
      harvestName: harvest.name,
      harvestInitialDate: this.formatDate(harvest.startDate)!,
      harvestEndDate: this.formatDate(harvest.endDate),
    }));
  }
}