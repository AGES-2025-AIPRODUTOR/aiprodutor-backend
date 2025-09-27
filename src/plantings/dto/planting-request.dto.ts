import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlantingRequestDto {
  @ApiProperty({ description: 'ID da área associada ao plantio', example: 1 })
  @IsInt()
  @IsNotEmpty()
  areaId: number;

  @ApiProperty({ description: 'ID do produto plantado', example: 1 })
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ description: 'ID da variedade do produto', example: 1 })
  @IsInt()
  @IsNotEmpty()
  varietyId: number;

  @ApiProperty({ description: 'Nome do plantio', example: 'Plantio de Milho' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Cor do plantio', example: 'Verde' })
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    description: 'Data do plantio',
    example: '2025-09-09T10:40:00Z',
  })
  @IsNotEmpty()
  plantingDate: Date;

  @ApiProperty({
    description: 'Data final do plantio',
    example: '2025-09-09T10:40:00Z',
  })
  @IsNotEmpty()
  plantingEndDate: Date;

  @ApiProperty({
    description: 'Data prevista para a colheita',
    example: '2026-09-09T10:40:00Z',
  })
  @IsNotEmpty()
  expectedHarvestDate: Date;

  @ApiProperty({ description: 'Quantidade plantada em kg', example: 1000 })
  @IsInt()
  @IsNotEmpty()
  quantityPlanted: number;

  @ApiProperty({ description: 'Quantidade colhida em kg', example: 800 })
  @IsInt()
  quantityHarvested: number;
}
