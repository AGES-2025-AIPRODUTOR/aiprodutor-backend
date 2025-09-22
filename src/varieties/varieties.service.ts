import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { VarietiesRepository } from './varieties.repository';
import { VarietyRequestDto } from './dto/variety-request.dto';
import { VarietyResponseDto } from './dto/variety-response.dto';
import { ProductsService } from '../products/products.service';
import { PlantingsRepository } from '../plantings/plantings.repository';

interface VarietyFromRepository {
    id: number;
    name: string;
    productId: number;
}

@Injectable()
export class VarietiesService {
    constructor(
        private readonly repository: VarietiesRepository,
        private readonly productsService: ProductsService,
        private readonly plantingsRepository: PlantingsRepository,
    ) { }

    private mapToResponseDto(varietyData: VarietyFromRepository): VarietyResponseDto {
        return {
            id: varietyData.id,
            name: varietyData.name,
            productId: varietyData.productId,
        };
    }

    async create(varietyRequestDto: VarietyRequestDto): Promise<VarietyResponseDto> {
        const { productId } = varietyRequestDto;

        await this.productsService.findOne(productId);
        const fullNewVariety = await this.repository.create(varietyRequestDto);
        return this.mapToResponseDto(fullNewVariety!);
    }

    async update(id: number, dto: VarietyRequestDto): Promise<VarietyResponseDto> {
        const varietyExists = await this.repository.findById(id);
        if (!varietyExists) {
            throw new NotFoundException(`Variedade com o ID ${id} não encontrada.`);
        }

        const updatedVariety = await this.repository.update(id, dto);
        return this.mapToResponseDto(updatedVariety!);
    }

    async findOne(id: number): Promise<VarietyResponseDto> {
        const variety = await this.repository.findById(id);
        if (!variety) {
            throw new NotFoundException(`Variedade com o ID ${id} não encontrada.`);
        }
        return this.mapToResponseDto(variety);
    }

    async findByProductId(productId: number): Promise<VarietyResponseDto[]> {
        await this.productsService.findOne(productId);

        const varieties = await this.repository.findByProductId(productId);
        return varieties.map((variety) => this.mapToResponseDto(variety));
    }

    async findAll(): Promise<VarietyResponseDto[]> {
        const varieties = await this.repository.findAll();
        return varieties.map((variety) => this.mapToResponseDto(variety));
    }

    async remove(id: number): Promise<VarietyResponseDto> {
        const varietyExists = await this.repository.findById(id);
        if (!varietyExists) {
            throw new NotFoundException(`Variedade com o ID ${id} não encontrada.`);
        }

        const varietyInUse = await this.plantingsRepository.existsByVarietyId(id);
        if (varietyInUse) {
            throw new BadRequestException('Não é possível remover a variedade, pois ela está em uso.');
        }

        const deletedVariety = await this.repository.remove(id);
        return this.mapToResponseDto(deletedVariety!);
    }
}