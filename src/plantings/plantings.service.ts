import { Injectable, NotFoundException } from '@nestjs/common';
import { PlantingsRepository } from './plantings.repository';
import { PlantingRequestDto } from './dto/planting-request.dto';
import { UpdatePlantingDto } from './dto/update-planting.dto';
import { PlantingResponseDto } from './dto/planting-response.dto';
import { ProductsService } from '../products/products.service';
import { VarietiesService } from '../varieties/varieties.service';
import { AreasService } from '../areas/areas.service';
import { HarvestsService } from '../harvests/harvests.service';


@Injectable()
export class PlantingsService {
  constructor(
    private readonly repository: PlantingsRepository,
    private readonly productsService: ProductsService,
    private readonly varietiesService: VarietiesService,
    private readonly areasService: AreasService,
    private readonly harvestsService: HarvestsService,
  ) {}

  private mapToResponseDto(plantingData: any): PlantingResponseDto {
    return {
      id: plantingData.id,
      harvestId: plantingData.harvestId, // <-- ADICIONAR
      name: plantingData.name,
      color: plantingData.color,
      areaId: plantingData.areaId,
      productId: plantingData.productId,
      varietyId: plantingData.varietyId,
      plantingDate: plantingData.plantingDate,
      plantingEndDate: plantingData.plantingEndDate,
      expectedHarvestDate: plantingData.expectedHarvestDate,
      quantityPlanted: plantingData.quantityPlanted,
      quantityHarvested: plantingData.quantityHarvested ?? null,
    };
  }

  async create(plantingRequestDto: PlantingRequestDto): Promise<PlantingResponseDto> {
    const { productId, varietyId, areaId, harvestId } = plantingRequestDto;

    // Valida a existência de todas as entidades relacionadas
    await Promise.all([
      this.productsService.findOne(productId),
      this.varietiesService.findOne(varietyId),
      this.areasService.findOne(areaId),
      this.harvestsService.findOne(harvestId), // <-- VALIDAR SAFRA
    ]);

    const planting = await this.repository.create(plantingRequestDto);
    return this.mapToResponseDto(planting);
  }

  async update(id: number, dto: UpdatePlantingDto): Promise<PlantingResponseDto> {
    await this.findOne(id); // Valida se o plantio existe

    // Se um novo harvestId for informado, valida se ele existe
    if (dto.harvestId) {
      await this.harvestsService.findOne(dto.harvestId);
    }
    
    // Valide outros IDs (areaId, productId) se eles puderem ser alterados também

    const updatedPlanting = await this.repository.update(id, dto);
    return this.mapToResponseDto(updatedPlanting);
  }

  // // muda status para "Excluido"
  // async remove(id: number): Promise<void> {
  //   const plantingExists = await this.repository.findById(id);
  //   if (!plantingExists) {
  //     throw new NotFoundException(`Plantio com o ID ${id} não encontrado.`);
  //   }

  //   await this.repository.changeStatusToExcluded(id);
  // }

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
}