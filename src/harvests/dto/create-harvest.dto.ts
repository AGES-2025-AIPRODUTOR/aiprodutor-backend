import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsInt,
  ValidateNested,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { HarvestStatus } from '@prisma/client';

class CreatePlantingNestedDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @Type(() => Date) @IsDate() @IsNotEmpty() plantingDate: Date;
  @ApiProperty() @IsNumber() @IsNotEmpty() quantityPlanted: number;
  @ApiProperty() @IsInt() @IsNotEmpty() productId: number;
  @ApiProperty({ example: [1] })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  areaIds: number[];
  @ApiPropertyOptional()
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  expectedHarvestDate?: Date;
}

export class CreateHarvestDto {
  @ApiProperty({ description: 'Nome da safra', example: 'Safra de Verão 2025' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'ID do produtor dono da safra', example: 1 })
  @IsInt()
  @IsNotEmpty()
  producerId: number;

  @ApiProperty({ description: 'Data de início da safra' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @ApiPropertyOptional({ description: 'Data final da safra' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Status da safra',
    example: 'em_andamento',
    enum: HarvestStatus,
  })
  @IsEnum(HarvestStatus)
  @IsOptional()
  status?: HarvestStatus;

  @ApiPropertyOptional({
    description: 'Lista de plantios a serem criados junto com a safra.',
    type: [CreatePlantingNestedDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePlantingNestedDto)
  plantings?: CreatePlantingNestedDto[];
}
