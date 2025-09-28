import { ApiProperty } from '@nestjs/swagger';

export class HarvestResponseDto {
  @ApiProperty({ description: 'ID único da safra', example: 1 })
  harvestId: number;

  @ApiProperty({ description: 'Nome da safra', example: 'Safra de Verão 2025' })
  harvestName: string;

  @ApiProperty({ description: 'Data de início da safra', example: '2025-09-22' })
  harvestInitialDate: Date;

  @ApiProperty({ description: 'Data final da safra', example: '2025-12-20', required: false })
  harvestEndDate: Date | null; // ← Aceita null
}