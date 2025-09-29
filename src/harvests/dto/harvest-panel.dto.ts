import { ApiProperty } from '@nestjs/swagger';

export class LinkedPlantingDto {
  @ApiProperty({ example: '1st orange planting' })
  plantingName: string;

  @ApiProperty({ example: 'Area 1' })
  plantingArea: string;

  @ApiProperty({ example: 10000 })
  expectedYield: number;

  @ApiProperty({ example: '2026-02-29' })
  plantingDate: Date;

  @ApiProperty({ example: '2027-02-25' })
  estimatedHarvestDate: Date | null;
}

export class GeneralInfoDto {
  @ApiProperty({ example: 3 })
  areaCount: number;

  @ApiProperty({ example: 25.0 })
  totalArea: number;

  @ApiProperty({ example: 'Orange' })
  cultivar: string;

  @ApiProperty({ example: 16000 })
  expectedYield: number;

  @ApiProperty({ example: '2026-02-29' })
  harvestStartDate: Date;

  @ApiProperty({ example: '2027-02-25', required: false })
  harvestEndDate: Date | null;

  @ApiProperty({ type: [LinkedPlantingDto] })
  linkedPlantings: LinkedPlantingDto[];
}

export class HarvestPanelResponseDto {
  @ApiProperty({ type: GeneralInfoDto })
  generalInfo: GeneralInfoDto;
}
