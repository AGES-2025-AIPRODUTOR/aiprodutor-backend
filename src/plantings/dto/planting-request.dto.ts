import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlantingRequestDto {
  
  @ApiProperty({ description: 'ID da safra associada ao plantio', example: 1 })
  @IsInt()
  @IsNotEmpty()
  harvestId: number;

  @ApiProperty({ description: 'ID da área associada ao plantio', example: 1 })
  @IsInt()
  @IsNotEmpty()
  areaId: number;


  @ApiProperty({ description: 'Nome do plantio', example: 'Plantio de Milho' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'ID do produto plantado', example: 1 })
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ description: 'ID da variedade do produto', example: 1 })
  @IsInt()
  @IsNotEmpty()
  varietyId: number;

  @ApiProperty({
    description: 'Data do plantio',
    example: '2025-09-09',
  })
  @IsNotEmpty()
  plantingDate: Date;

  @ApiProperty({
    description: 'Data final do plantio',
    example: '2025-09-09',
  })
  @IsNotEmpty()
  plantingEndDate: Date;

  @ApiProperty({
    description: 'Data prevista para a colheita',
    example: '2026-09-09',
  })
  @IsNotEmpty()
  expectedHarvestDate: Date;

  @ApiProperty({ description: 'Quantidade plantada em kg', example: 1000 })
  @IsInt()
  @IsNotEmpty()
  quantityPlanted: number;

  @ApiProperty({ 
    description: 'Quantidade colhida em kg (opcional na criação)', 
    example: 800,
    required: false
  })
  @IsInt()
  @IsOptional() 
  quantityHarvested?: number;
}