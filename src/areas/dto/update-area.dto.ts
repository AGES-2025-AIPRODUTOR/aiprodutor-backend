import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber, IsPositive } from 'class-validator';

export class UpdateAreaDto {
  @ApiProperty({
    example: 'Novo Nome',
    description: 'Nome da área de plantio',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 1,
    description: 'ID do tipo de solo',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  soilTypeId?: number;

  @ApiProperty({
    example: 1,
    description: 'ID do tipo de irrigação',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  irrigationTypeId?: number;

  @ApiProperty({
    description: 'Tamanho da área em metros quadrados (m²)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  areaM2?: number;

  @ApiProperty({
    example: true,
    description: 'Define se a área está ativa (true) ou inativa (false)',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}