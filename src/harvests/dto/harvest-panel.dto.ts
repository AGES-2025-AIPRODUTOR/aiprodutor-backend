import { ApiProperty } from '@nestjs/swagger';

export class LinkedPlantingDto {
  @ApiProperty({ example: '1st orange planting' })
  planting_name: string;

  @ApiProperty({ example: 'Area 1' })
  planting_area: string;

  @ApiProperty({ example: 10000 })
  expected_yield: number;

  @ApiProperty({ example: '2026-02-29' })
  planting_date: Date;

  @ApiProperty({ example: '2027-02-25' })
  estimated_harvest_date: Date;
}

export class GeneralInfoDto {
  @ApiProperty({ example: 3 })
  area_count: number;

  @ApiProperty({ example: 25.0 })
  total_area: number;

  @ApiProperty({ example: 'Orange' })
  cultivar: string;

  @ApiProperty({ example: 16000 })
  expected_yield: number;

  @ApiProperty({ example: '2026-02-29' })
  harvest_start_date: Date;

  @ApiProperty({ example: '2027-02-25', required: false })
  harvest_end_date: Date | null; // ← Aceita null

  @ApiProperty({ type: [LinkedPlantingDto] })
  linked_plantings: LinkedPlantingDto[];
}

export class HarvestPanelResponseDto {
  @ApiProperty({ type: GeneralInfoDto })
  generalInfo: GeneralInfoDto;
}
