import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';

export class UpdatePlantingDto {
  @ApiProperty({
    description: 'Nome do plantio',
    example: 'Plantio de Tomate Cereja - Verão 2025',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Data de início do plantio',
    example: '2025-09-25T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  plantingDate?: string;

  @ApiProperty({
    description: 'Data de término do plantio',
    example: '2025-10-05T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  plantingEndDate?: string;

  @ApiProperty({
    description: 'Data prevista para colheita',
    example: '2025-12-15T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expectedHarvestDate?: string;

  @ApiProperty({
    description: 'Quantidade plantada',
    example: 500.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantityPlanted?: number;

  @ApiProperty({
    description: 'Quantidade colhida',
    example: 480.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantityHarvested?: number;

  @ApiProperty({
    description: 'ID da safra',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  harvestId?: number;

  @ApiProperty({
    description: 'ID do produto',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  productId?: number;

  @ApiProperty({
    description: 'ID da variedade',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  varietyId?: number;

  @ApiProperty({
    description: 'Produção esperada',
    example: 600.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  expectedYield?: number;
}
