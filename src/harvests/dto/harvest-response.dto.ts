import { ApiProperty } from '@nestjs/swagger';


class PlantingInHarvestResponseDto {
  @ApiProperty({ example: 1, description: 'ID do plantio' })
  id: number;

  @ApiProperty({ example: 'Plantio de Tomate Cereja', description: 'Nome do plantio' })
  name: string;
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
    example: '2025-09-22T00:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'Data final da safra',
    example: '2025-12-20T23:59:59.000Z',
    required: false,
  })
  endDate: Date | null;

  @ApiProperty({
    description: 'Status da safra',
    example: 'Ativa',
    required: false,
  })
  status?: string;

  @ApiProperty({ 
    description: 'Lista de plantios associados a esta safra.',
    type: [PlantingInHarvestResponseDto] 
  })
  plantings: PlantingInHarvestResponseDto[];
}