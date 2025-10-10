import { ApiProperty } from '@nestjs/swagger';

class AreaInPlantingResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  color: string;
}

export class PlantingResponseDto {
    @ApiProperty({ description: 'ID único do plantio', example: 1 })
    id: number;

    @ApiProperty({ description: 'Nome do plantio', example: 'Plantio de Milho' })
    name: string;

    @ApiProperty({ description: 'ID da safra associada', example: 1 })
    harvestId: number;
    
    @ApiProperty({ description: 'ID do produto plantado', example: 1 })
    productId: number;

    @ApiProperty({ description: 'Data do plantio', example: '2025-09-09' })
    plantingDate: Date;

    @ApiProperty({ description: 'Data final do plantio', example: '2025-09-09' })
    plantingEndDate: Date;

    @ApiProperty({ description: 'Data prevista para a colheita', example: '2026-09-09' })
    expectedHarvestDate: Date;

    @ApiProperty({ description: 'Quantidade plantada em kg', example: 1000 })
    quantityPlanted: number;

    @ApiProperty({ description: 'Quantidade colhida em kg', example: 800 })
    quantityHarvested: number | null;

    @ApiProperty({ type: [AreaInPlantingResponseDto] })
    areas: AreaInPlantingResponseDto[];
}