import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, IsEnum } from 'class-validator';
import { HarvestStatus } from '@prisma/client';

export class UpdateHarvestDto {
  @ApiPropertyOptional({ description: 'Nome da safra' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Data de início da safra' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Data final da safra' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Status da safra',
    example: 'concluida',
    enum: HarvestStatus,
  })
  @IsEnum(HarvestStatus)
  @IsOptional()
  status?: HarvestStatus;
}
