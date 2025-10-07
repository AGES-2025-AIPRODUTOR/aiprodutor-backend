import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsEnum } from 'class-validator';
import { HarvestStatus } from '@prisma/client';

export class GetHarvestHistoryQueryDto {
  @ApiProperty({
    description: 'Filtrar por status da safra',
    required: false,
    enum: HarvestStatus,
  })
  @IsEnum(HarvestStatus)
  @IsOptional()
  status?: HarvestStatus;

  @ApiProperty({
    description: 'Filtrar por nome da safra (busca parcial)',
    required: false,
  })
  @IsString()
  @IsOptional()
  safraName?: string;

  @ApiProperty({
    description: 'Filtrar por data inicial da safra (formato YYYY-MM-DD)',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  safraInitialDate?: string;

  @ApiProperty({
    description: 'Filtrar por data final da safra (formato YYYY-MM-DD)',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  safraEndDate?: string;
}