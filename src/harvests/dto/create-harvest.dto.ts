import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreateHarvestDto {
  @ApiProperty({ description: 'Nome da safra', example: 'Safra de Verão 2025' })
  @IsString()
  @IsNotEmpty()
  name: string;

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
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    description: 'Data final da safra',
    example: '2025-12-20',
    required: false,
  })
  @IsDateString()
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

  @ApiProperty({ description: 'ID do plantio', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  plantingId: number;
}
