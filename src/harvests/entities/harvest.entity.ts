import { ApiProperty } from '@nestjs/swagger';

export class HarvestEntity {
  @ApiProperty({ description: 'ID único da safra', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome da safra', example: 'Safra de Verão 2025' })
  name: string;

  @ApiProperty({ description: 'Ciclo da safra', example: 'Verão', required: false })
  cycle?: string;

  @ApiProperty({ description: 'Data de início da safra', example: '2025-09-22T00:00:00.000Z' })
  startDate: Date;

  @ApiProperty({ description: 'Data final da safra', example: '2025-12-20T23:59:59.000Z', required: false })
  endDate: Date | null; // ← Aceita null

  @ApiProperty({ description: 'Status da safra', example: 'Ativa', required: false })
  status?: string;

  @ApiProperty({ description: 'ID do produtor', example: 1 })
  producerId: number;

  @ApiProperty({ description: 'Data de criação', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(partial: Partial<HarvestEntity>) {
    Object.assign(this, partial);
  }
}