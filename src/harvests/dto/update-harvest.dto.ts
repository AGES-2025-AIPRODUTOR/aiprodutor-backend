import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateHarvestDto {
  @ApiProperty({
    description: 'Nome da safra',
    example: 'Safra de Verão 2025',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Ciclo da safra',
    example: 'Verão',
    required: false,
  })
  @IsString()
  @IsOptional()
  cycle?: string;

  @ApiProperty({
    description: 'Data de início da safra',
    example: '2025-09-22',
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({
    description: 'Data final da safra',
    example: '2025-12-20',
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({
    description: 'Status da safra',
    example: 'Ativa',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;
  
  @ApiProperty({
    description: 'Array com os novos IDs de áreas para associar à safra. Substituirá a lista antiga.',
    example: [3, 4],
    required: false,
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  areaIds?: number[];
}