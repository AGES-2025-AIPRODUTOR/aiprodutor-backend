import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsInt,
  ValidateNested,
  IsNumber,
} from 'class-validator';

class CreatePlantingNestedDto {
  @ApiProperty({ example: 'Plantio de Tomate Cereja' })
  @IsString() @IsNotEmpty() name: string;

  @ApiProperty({
    description: 'Data do plantio',
    example: '2025-09-25',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  plantingDate: Date;

  @ApiProperty({
    description: 'Data prevista para a colheita (opcional)',
    example: '2025-12-15',
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  expectedHarvestDate?: Date;
  
  @ApiProperty({ example: 500 })
  @IsNumber() @IsNotEmpty() quantityPlanted: number;

  @ApiProperty({ example: 1 })
  @IsInt() @IsNotEmpty() productId: number;

  @ApiProperty({ example: 1 })
  @IsInt() @IsNotEmpty() varietyId: number;

  @ApiProperty({ example: [1] })
  @IsArray() @IsInt({ each: true }) @IsNotEmpty() areaIds: number[];
}

export class CreateHarvestDto {
  @ApiProperty({ description: 'Nome da safra', example: 'Safra de Verão 2025' })
  @IsString() @IsNotEmpty() name: string;

  @ApiProperty({ description: 'ID do produtor dono da safra', example: 1 })
  @IsInt() @IsNotEmpty() producerId: number;
  
  @ApiProperty({
    description: 'Array com os IDs das áreas que pertencem a esta safra.',
    example: [1, 2],
  })
  @IsArray() @IsInt({ each: true }) @IsNotEmpty() areaIds: number[];

  @ApiProperty({
    description: 'Data de início da safra',
    example: '2025-09-22',
  })
  @Type(() => Date) @IsDate() @IsNotEmpty() startDate: Date;

  @ApiProperty({
    description: 'Data final da safra',
    example: '2025-12-20',
    required: false,
  })
  @Type(() => Date) @IsDate() @IsOptional() endDate?: Date;

  @ApiProperty({
    description: 'Status da safra',
    example: 'Ativa',
    required: false,
  })
  @IsString() @IsOptional() status?: string;

  @ApiProperty({
    description: 'Lista opcional de plantios a serem criados junto com a safra.',
    type: [CreatePlantingNestedDto],
    required: false,
    example: [
      {
        name: "Plantio de Tomate Cereja (na Área 1)",
        plantingDate: "2025-09-25",
        expectedHarvestDate: "2025-12-15",
        quantityPlanted: 500,
        productId: 1,
        varietyId: 1,
        areaIds: [1]
      },
      {
        name: "Plantio de Alface Crespa (na Área 2)",
        plantingDate: "2025-10-01",
        quantityPlanted: 1200,
        productId: 2,
        varietyId: 3,
        areaIds: [2]
      }
    ]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePlantingNestedDto)
  plantings?: CreatePlantingNestedDto[];
}