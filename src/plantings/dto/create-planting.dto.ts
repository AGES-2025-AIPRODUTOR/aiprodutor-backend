import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreatePlantingDto {
  @ApiProperty({ description: 'Nome do plantio', example: 'Plantio de Soja 2025' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Data de início do plantio' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  plantingDate: Date;

  @ApiPropertyOptional({ description: 'Data final do plantio (opcional)' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  plantingEndDate?: Date;

  @ApiPropertyOptional({ description: 'Data prevista para a colheita (opcional)' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  expectedHarvestDate?: Date;

  @ApiProperty({ description: 'Quantidade plantada', example: 500 })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantityPlanted: number;
  
  @ApiPropertyOptional({ description: 'Previsão de rendimento (opcional)' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  expectedYield?: number;

  @ApiProperty({ description: 'ID da safra associada', example: 1 })
  @IsInt()
  @IsNotEmpty()
  harvestId: number;

  @ApiProperty({ description: 'ID do produto associado', example: 1 })
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({
    description: 'Array com os IDs das áreas onde o plantio ocorre',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty({ each: true })
  areaIds: number[];
}