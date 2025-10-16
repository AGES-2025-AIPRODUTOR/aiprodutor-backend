import { ApiProperty } from '@nestjs/swagger';

class ProducerInHarvestResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
}

class PlantingInHarvestResponseDto {
  @ApiProperty({ example: 1, description: 'ID do plantio' })
  id: number;

  @ApiProperty({
    example: 'Plantio de Tomate Cereja',
    description: 'Nome do plantio',
  })
  name: string;
}

export class InProgressHarvestDto {
  @ApiProperty({
    description: 'Nome da safra',
    example: 'Safra de Uva',
  })
  harvestName: string;

  @ApiProperty({
    description: 'Data de início da safra',
    example: '2025-11-19T03:00:00.000Z',
  })
  harvestInitialDate: Date;

  @ApiProperty({
    description: 'Data final da safra',
    example: '2028-11-23T03:00:00.000Z',
    required: false,
  })
  harvestEndDate: Date | null;
}

export class HarvestResponseDto {
  @ApiProperty({ description: 'ID único da safra', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome da safra', example: 'Safra de Verão 2025' })
  name: string;

  @ApiProperty({
    description: 'Data de início da safra',
    example: '2025-11-19T03:00:00.000Z',
  })
  harvestInitialDate: Date;

  @ApiProperty({
    description: 'Data final da safra',
    example: '2028-11-23T03:00:00.000Z',
    required: false,
  })
  harvestEndDate: Date | null;

  @ApiProperty({
    description: 'Status da safra',
    example: 'Ativa',
    required: false,
  })
  status?: string;

  @ApiProperty({ type: ProducerInHarvestResponseDto })
  producer: ProducerInHarvestResponseDto;

  @ApiProperty({ type: [PlantingInHarvestResponseDto] })
  plantings: PlantingInHarvestResponseDto[];
}
