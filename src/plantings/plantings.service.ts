import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PlantingsRepository } from './plantings.repository';
import { CreatePlantingDto } from './dto/create-planting.dto';
import { UpdatePlantingDto } from './dto/update-planting.dto';
import { PlantingResponseDto } from './dto/planting-response.dto';
import { ProductsService } from '../products/products.service';
import { AreasService } from '../areas/areas.service';
import { HarvestsService } from '../harvests/harvests.service';

@Injectable()
export class PlantingsService {
  constructor(
    private readonly repository: PlantingsRepository,
    private readonly productsService: ProductsService,
    private readonly areasService: AreasService,
    private readonly harvestsService: HarvestsService,
  ) {}

  private mapToResponseDto(plantingData: any): PlantingResponseDto {
    return {
      id: plantingData.id,
      harvestId: plantingData.harvestId,
      name: plantingData.name,
      productId: plantingData.productId,
      areas: plantingData.areas.map((area) => ({
        id: area.id,
        name: area.name,
        color: area.color,
      })),
      plantingDate: plantingData.plantingDate,
      plantingEndDate: plantingData.plantingEndDate,
      expectedHarvestDate: plantingData.expectedHarvestDate,
      quantityPlanted: plantingData.quantityPlanted,
      quantityHarvested: plantingData.quantityHarvested ?? null,
    };
  }

  async create(
    createPlantingDto: CreatePlantingDto,
  ): Promise<PlantingResponseDto> {
    const { productId, areaIds, harvestId } = createPlantingDto;

    // 1. Valida se a safra e o produto existem e captura o objeto da safra.
    const [_, harvest] = await Promise.all([
      this.productsService.findOne(productId),
      this.harvestsService.findOne(harvestId),
    ]);

    // 2. Valida se todas as áreas informadas existem e pertencem ao mesmo produtor da safra.
    for (const areaId of areaIds) {
      const area = await this.areasService.findOne(areaId);
      if (area.producerId !== harvest.producerId) {
        throw new BadRequestException(
          `A área #${areaId} não pertence ao mesmo produtor da safra #${harvestId}.`,
        );
      }
    }

    const newPlanting = await this.repository.create(createPlantingDto);
    return this.mapToResponseDto(newPlanting);
  }

  async update(
    id: number,
    dto: UpdatePlantingDto,
  ): Promise<PlantingResponseDto> {
    await this.findOne(id); // Valida se o plantio existe

    if (dto.harvestId) {
      await this.harvestsService.findOne(dto.harvestId);
    }

    const updatedPlanting = await this.repository.update(id, dto);
    return this.mapToResponseDto(updatedPlanting);
  }

  async findOne(id: number): Promise<PlantingResponseDto> {
    const planting = await this.repository.findById(id);
    if (!planting) {
      throw new NotFoundException(`Plantio com o ID ${id} não encontrado.`);
    }
    return this.mapToResponseDto(planting);
  }

  async findByProductId(productId: number): Promise<PlantingResponseDto[]> {
    await this.productsService.findOne(productId);

    const plantings = await this.repository.findByProductId(productId);
    return plantings.map((planting) => this.mapToResponseDto(planting));
  }

  async findAll(): Promise<PlantingResponseDto[]> {
    const plantings = await this.repository.findAll();
    return plantings.map((planting) => this.mapToResponseDto(planting));
  }
  
  async findByProducerId(producerId: number): Promise<PlantingResponseDto[]> {
    const plantings = await this.repository.findByProducerId(producerId);
    return plantings.map((planting) => this.mapToResponseDto(planting));
  }

  async remove(id: number): Promise<void> {
    const planting = await this.repository.findById(id);
    if (!planting) {
      throw new NotFoundException(`Plantio com o ID ${id} não encontrado.`);
    }
    await this.repository.remove(id);
  }
}