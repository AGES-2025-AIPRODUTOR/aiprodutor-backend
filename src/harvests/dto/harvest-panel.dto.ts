import { ApiProperty } from '@nestjs/swagger';

class LinkedPlantingDto {
  @ApiProperty({ example: '1st orange planting' })
  plantingName: string;

  @ApiProperty({ example: 'Area 1, Area 2' })
  plantingArea: string;

  @ApiProperty({ example: 10000, required: false, nullable: true })
  expectedYield: number | null;

  @ApiProperty({ example: '2026-02-29T03:00:00.000Z' })
  plantingDate: Date;

  @ApiProperty({ example: '2027-02-25T03:00:00.000Z', required: false, nullable: true })
  estimatedHarvestDate: Date | null;
}

class GeneralInfoDto {
  @ApiProperty({ example: 3 })
  areaCount: number;

  @ApiProperty({ example: 25.0, description: 'Área total em hectares (ha)' })
  totalArea: number;

  @ApiProperty({ example: 'Orange, Lemon' })
  cultivar: string;

  @ApiProperty({ example: 16000, required: false, nullable: true })
  expectedYield: number | null;

  @ApiProperty({ example: '2026-02-29T03:00:00.000Z' })
  harvestStartDate: Date;

  @ApiProperty({ example: '2027-02-25T03:00:00.000Z', required: false, nullable: true })
  harvestEndDate: Date | null;

  @ApiProperty({ type: [LinkedPlantingDto] })
  linkedPlantings: LinkedPlantingDto[];
}

export class HarvestPanelResponseDto {
  @ApiProperty({ type: GeneralInfoDto })
  generalInfo: GeneralInfoDto;
}