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
import { ProducersService } from '../producers/producers.service';
import { GetHarvestHistoryQueryDto } from './dto/get-harvest-history-query.dto';
import { HarvestHistoryResponseDto } from './dto/harvest-history-response.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class HarvestsService {
  constructor(
    private readonly repository: HarvestsRepository,
    private readonly areasService: AreasService,
    private readonly producersService: ProducersService,
    private readonly productsService: ProductsService,
  ) {}

  /**
   * Cria uma nova safra, validando todas as suas dependências.
   */
  async create(createHarvestDto: CreateHarvestDto): Promise<HarvestEntity> {
    const { producerId, name, plantings } = createHarvestDto;

    // 1. Valida se já existe uma safra com o mesmo nome para evitar duplicatas
    const existingHarvest = await this.repository.findByName(name);
    if (existingHarvest) {
      throw new ConflictException(`Já existe uma safra com o nome "${name}".`);
    }

    // 2. Valida se o produtor informado existe
    await this.producersService.findOne(producerId);

    // 3. Se houver plantios aninhados, valida cada um deles
    if (plantings && plantings.length > 0) {
      for (const planting of plantings) {
        // Valida se o produto e as áreas do plantio existem
        await this.productsService.findOne(planting.productId);
        for (const areaId of planting.areaIds) {
          const area = await this.areasService.findOne(areaId);
          if (area.producerId !== producerId) {
            throw new BadRequestException(
              `A área #${areaId} informada no plantio "${planting.name}" não pertence ao produtor da safra.`,
            );
          }
        }
      }
    }

    const newHarvest = await this.repository.create(createHarvestDto);
    return new HarvestEntity(newHarvest);
  }

  /**
   * Busca todas as safras.
   */
  async findAll(): Promise<HarvestEntity[]> {
    const harvests = await this.repository.findAll();
    return harvests.map((harvest) => new HarvestEntity(harvest));
  }

  /**
   * Busca uma safra específica pelo seu ID.
   */
  async findOne(id: number): Promise<HarvestEntity> {
    const harvest = await this.repository.findById(id);
    if (!harvest) {
      throw new NotFoundException(`Safra com o ID #${id} não encontrada.`);
    }
    return new HarvestEntity(harvest);
  }

  /**
   * Atualiza os dados de uma safra.
   */
  async update(
    id: number,
    updateHarvestDto: UpdateHarvestDto,
  ): Promise<HarvestEntity> {
    await this.findOne(id); // Garante que a safra existe

    const harvest = await this.repository.update(id, updateHarvestDto);
    return new HarvestEntity(harvest);
  }

  /**
   * Remove uma safra, se ela não tiver plantios associados.
   */
  async remove(id: number): Promise<HarvestEntity> {
    const harvest = await this.findOne(id);
    if (harvest.plantings && harvest.plantings.length > 0) {
      throw new ConflictException(
        `Não é possível excluir a safra, pois ela possui ${harvest.plantings.length} plantios associados.`,
      );
    }
    const removedHarvest = await this.repository.remove(id);
    return new HarvestEntity(removedHarvest);
  }

  /**
   * Busca todas as safras de um produtor.
   */
  async findByProducerId(producerId: number): Promise<HarvestEntity[]> {
    await this.producersService.findOne(producerId);
    const harvests = await this.repository.findByProducerId(producerId);
    return harvests.map((h) => new HarvestEntity(h));
  }

  /**
   * Monta e retorna os dados para o painel de controle de uma safra.
   */
  async getHarvestPanel(id: number): Promise<HarvestPanelResponseDto> {
    const harvest = await this.repository.findById(id);
    if (!harvest) {
      throw new NotFoundException(`Safra com o ID #${id} não encontrada.`);
    }

    const allAreas = harvest.plantings.flatMap((p) => p.areas);
    const uniqueAreas = Array.from(
      new Map(allAreas.map((a) => [a.id, a])).values(),
    );

    const totalAreaInMeters = uniqueAreas.reduce(
      (sum, area) => sum + area.areaM2.toNumber(),
      0,
    );
    const totalAreaInHectares = parseFloat(
      (totalAreaInMeters / 10000).toFixed(2),
    );

    const linkedPlantings = harvest.plantings.map((p) => ({
      plantingName: p.name,
      plantingArea: p.areas.map((a) => a.name).join(', '),
      expectedYield: p.expectedYield,
      plantingDate: p.plantingDate,
      estimatedHarvestDate: p.expectedHarvestDate,
    }));

    const cultivares = [
      ...new Set(harvest.plantings.map((p) => p.product.name)),
    ].join(', ');

    return {
      generalInfo: {
        areaCount: uniqueAreas.length,
        totalArea: totalAreaInHectares,
        cultivar: cultivares || 'Nenhum',
        expectedYield: harvest.expectedYield,
        harvestStartDate: harvest.startDate,
        harvestEndDate: harvest.endDate,
        linkedPlantings: linkedPlantings,
      },
    };
  }

  /**
   * Busca o histórico de safras de um produtor com base em filtros.
   */
  async findHistoryByProducer(
    producerId: number,
    queryDto: GetHarvestHistoryQueryDto,
  ): Promise<HarvestHistoryResponseDto[]> {
    await this.producersService.findOne(producerId);

    const harvestsFromDb = await this.repository.findHistoryByProducer(
      producerId,
      queryDto,
    );

    // Mapeia os resultados para o DTO de resposta.
    return harvestsFromDb.map((harvest) => {
      const allAreasFromPlantings = harvest.plantings.flatMap(p => p.areas);
      const uniqueAreas = Array.from(new Map(allAreasFromPlantings.map(a => [a.id, a])).values());

      return {
        safraId: harvest.id,
        safraName: harvest.name,
        safraInitialDate: harvest.startDate,
        safraEndDate: harvest.endDate,
        areas: uniqueAreas.map(a => ({ id: a.id, name: a.name })), // Áreas únicas da safra
        status: harvest.status,
        planting: harvest.plantings.map(p => ({
          id: p.id,
          initialDate: p.plantingDate,
          estimatedEndDate: p.expectedHarvestDate,
          qtyEstimated: `${p.quantityPlanted.toString()}`,
          areaName: p.areas.map(a => a.name),
        })),
      };
    });
  }

  /**
   * Busca safras em andamento de um produtor.
   */
  async findInProgressByProducer(
    producerId: number,
  ): Promise<HarvestEntity[]> {
    await this.producersService.findOne(producerId);
    const harvests = await this.repository.findInProgressByProducer(producerId);
    return harvests.map((harvest) => new HarvestEntity(harvest));
  }
}
