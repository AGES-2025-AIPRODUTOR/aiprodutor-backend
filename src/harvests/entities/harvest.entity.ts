import { ApiProperty } from '@nestjs/swagger';

export class HarvestEntity {
  @ApiProperty({ description: 'ID único da safra', example: 1 })
  haverstId: number;

  @ApiProperty({ description: 'Nome da safra', example: 'Safra de Verão 2025' })
  harvestName: string;

  @ApiProperty({ description: 'Ciclo da safra', example: 'Verão', required: false })
  harvestCycle?: string;

  @ApiProperty({ description: 'Data de início da safra', example: '2025-09-22' })
  harvestInitialDate: Date;

  @ApiProperty({ description: 'Data final da safra', example: '2025-12-20', required: false })
  harvestEndDate: Date | null; // ← Aceita null

  @ApiProperty({ description: 'Status da safra', example: 'Ativa', required: false })
  harvestStatus?: string;

  @ApiProperty({ description: 'ID do produtor', example: 1 })
  producerId: number;

  @ApiProperty({ description: 'Data de criação', example: '2024-01-01' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização', example: '2024-01-01' })
  updatedAt: Date;

  constructor(partial: Partial<HarvestEntity>) {
    Object.assign(this, partial);
  }
}