import { ApiProperty } from '@nestjs/swagger';

class LinkedPlantingDto {
  @ApiProperty({ example: '1st orange planting' })
  plantingName: string;

  @ApiProperty({ example: 'Area 1, Area 2' })
  plantingArea: string;

  @ApiProperty({ example: 10000, required: false, nullable: true })
  expectedYield: number | null;

  @ApiProperty({ example: '29/02/2026' })
  plantingDate: string;

  @ApiProperty({ example: '25/02/2027', required: false, nullable: true })
  estimatedHarvestDate: string | null;
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

  @ApiProperty({ example: '29/02/2026' })
  harvestStartDate: string;

  @ApiProperty({ example: '25/02/2027', required: false, nullable: true })
  harvestEndDate: string | null;

  @ApiProperty({ type: [LinkedPlantingDto] })
  linkedPlantings: LinkedPlantingDto[];
}

export class HarvestPanelResponseDto {
  @ApiProperty({ type: GeneralInfoDto })
  generalInfo: GeneralInfoDto;
}