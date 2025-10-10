import { ApiProperty } from '@nestjs/swagger';

export class PlantingHistoryResponseDto {
  @ApiProperty({ example: 'Campo Norte', description: 'Nome da área' })
  areaName: string;

  @ApiProperty({
    example: 'Plantio de Soja Verão 2025',
    description: 'Nome do plantio',
  })
  plantingName: string;

  @ApiProperty({ example: 'Soja BRS 5980', description: 'Nome do produto' })
  productName: string | null;

  @ApiProperty({ example: 'Safra de Verão 2025', description: 'Nome da safra' })
  safraName: string | null;

  @ApiProperty({ example: true, description: 'Status da área (ativa/inativa)' })
  areaStatus: boolean;

  @ApiProperty({
    example: '2025-10-15T00:00:00.000Z',
    description: 'Data de início do plantio',
  })
  plantingDate: Date;

  @ApiProperty({
    example: '2026-03-20T00:00:00.000Z',
    description: 'Data final da colheita (fim da safra)',
    required: false,
  })
  harvestDate: Date | null;

  @ApiProperty({ example: 500.0, description: 'Quantidade plantada' })
  quantityPlanted: number;

  @ApiProperty({
    example: 480.5,
    description: 'Quantidade colhida',
    required: false,
  })
  quantityHarvested: number | null;

  @ApiProperty({
    example: 155000.5,
    description: 'Tamanho da área em metros quadrados (m²)',
  })
  areaM2: number;
}
