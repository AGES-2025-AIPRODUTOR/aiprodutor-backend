import { ApiProperty } from '@nestjs/swagger';

class AreaInHarvestResponseDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
}

class ProducerInHarvestResponseDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
}

class PlantingInHarvestResponseDto {
  @ApiProperty({ example: 1, description: 'ID do plantio' })
  id: number;

  @ApiProperty({ example: 'Plantio de Tomate Cereja', description: 'Nome do plantio' })
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
    example: '2025-11-19',
  })
  harvestInitialDate: string;

  @ApiProperty({
    description: 'Data final da safra',
    example: '2028-11-23',
    required: false,
  })
  harvestEndDate: string | null;
}

export class HarvestResponseDto {
  @ApiProperty({ description: 'ID único da safra', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome da safra', example: 'Safra de Verão 2025' })
  name: string;

  @ApiProperty({
    description: 'Ciclo da safra',
    example: 'Verão',
    required: false,
  })
  cycle?: string;

  @ApiProperty({
    description: 'Data de início da safra',
    example: '2025-09-22',
  })
  startDate: Date;

  @ApiProperty({
    description: 'Data final da safra',
    example: '2025-12-20',
    required: false,
  })
  endDate: Date | null;

  @ApiProperty({
    description: 'Status da safra',
    example: 'Ativa',
    required: false,
  })
  status?: string;

  @ApiProperty({ type: ProducerInHarvestResponseDto })
  producer: ProducerInHarvestResponseDto;

  @ApiProperty({ type: [AreaInHarvestResponseDto] })
  areas: AreaInHarvestResponseDto[];

  @ApiProperty({ type: [PlantingInHarvestResponseDto] })
  plantings: PlantingInHarvestResponseDto[];

}