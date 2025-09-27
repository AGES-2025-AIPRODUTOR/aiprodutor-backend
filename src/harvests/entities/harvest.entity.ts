import { ApiProperty } from '@nestjs/swagger';
import { Planting } from '@prisma/client';

class PlantingEntity implements Partial<Planting> {
  @ApiProperty({ description: 'ID do plantio' })
  id: number;

  @ApiProperty({ description: 'Nome do plantio' })
  name: string;

  @ApiProperty({ description: 'Data do plantio' })
  plantingDate: Date;
  
  constructor(partial: Partial<PlantingEntity>) {
    Object.assign(this, partial);
  }
}

export class HarvestEntity {
  @ApiProperty({ description: 'ID único da safra', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome da safra', example: 'Safra de Verão 2025' })
  name: string;

  @ApiProperty({
    description: 'Ciclo da safra',
    example: 'Verão',
    required: false,
  })
  cycle?: string | null;

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
  status?: string | null;

  @ApiProperty({
    description: 'Lista de plantios que pertencem a esta safra.',
    type: () => [PlantingEntity],
  })
  plantings: PlantingEntity[];

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<HarvestEntity>) {
    Object.assign(this, partial);
    if (partial.plantings) {
      this.plantings = partial.plantings.map(p => new PlantingEntity(p));
    }
  }
}