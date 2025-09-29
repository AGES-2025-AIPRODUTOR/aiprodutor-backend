import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class GetHarvestHistoryQueryDto {
  @ApiProperty({
    description: 'Filtrar por status da safra (ex: concluida)',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;

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