import { ApiProperty } from '@nestjs/swagger';

class AreaHistoryDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
}

class PlantingHistoryDto {
  @ApiProperty({ example: 101 })
  id: number;

  @ApiProperty({ example: '2025-03-01' })
  initialDate: Date;

  @ApiProperty({ example: '2025-08-10' })
  estimatedEndDate: Date | null;

  @ApiProperty({ example: '500kg' })
  qtyEstimated: string;

  @ApiProperty({ example: ['Área Principal', 'Área Secundária'] })
  areaName: string[];
}

export class HarvestHistoryResponseDto {
  @ApiProperty({ example: 14 })
  safraId: number;

  @ApiProperty({ example: 'Safra de Soja' })
  safraName: string;

  @ApiProperty({ example: '2025-03-01' })
  safraInitialDate: Date;

  @ApiProperty({ example: '2025-08-10' })
  safraEndDate: Date | null;

  @ApiProperty({
    description: 'Lista de áreas principais associadas à safra',
    type: [AreaHistoryDto],
  })
  areas: AreaHistoryDto[];

  @ApiProperty()
  status: string | null;

  @ApiProperty({ type: [PlantingHistoryDto] })
  planting: PlantingHistoryDto[];
}
