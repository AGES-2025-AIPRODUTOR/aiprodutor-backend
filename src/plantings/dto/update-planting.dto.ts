import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlantingDto {
    @ApiProperty({ description: 'ID da área associada ao plantio', example: 1 })
    @IsInt()
    areaId: number;

    @ApiProperty({ description: 'ID do produto plantado', example: 1 })
    @IsInt()
    productId: number;

    @ApiProperty({ description: 'ID da variedade do produto', example: 1 })
    @IsInt()
    varietyId: number;

    @ApiProperty({ description: 'Data do plantio', example: '2025-09-09T10:40:00Z' })
    plantingDate: Date;

    @ApiProperty({ description: 'Data prevista para a colheita', example: '2026-09-09T10:40:00Z' })
    expectedHarvestDate: Date;

    // @ApiProperty({ description: 'Data da colheita', example: '2026-09-09T10:40:00Z' })
    // harvestDate: Date | null;

    @ApiProperty({ description: 'Quantidade plantada em kg', example: 1000 })
    @IsInt()
    plantedQuantity: number;

    @ApiProperty({ description: 'Quantidade colhida em kg', example: 800 })
    @IsInt()
    harvestedQuantity: number;
}