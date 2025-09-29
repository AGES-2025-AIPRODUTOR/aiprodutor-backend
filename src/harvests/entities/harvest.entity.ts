import { ApiProperty } from '@nestjs/swagger';
import { Planting, Area } from '@prisma/client';
import { Producer } from '../../producers/entities/producer.entity';

class AreaInHarvestEntity implements Partial<Area> {
  @ApiProperty({ description: 'ID da área' })
  id: number;

  @ApiProperty({ description: 'Nome da área' })
  name: string;

  constructor(partial: Partial<AreaInHarvestEntity>) {
    Object.assign(this, partial);
  }
}

class PlantingInHarvestEntity implements Partial<Planting> {
  @ApiProperty({ description: 'ID do plantio' })
  id: number;

  @ApiProperty({ description: 'Nome do plantio' })
  name: string;

  @ApiProperty({ description: 'Data do plantio' })
  plantingDate: Date;

  constructor(partial: Partial<PlantingInHarvestEntity>) {
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
  status?: string | null;

  @ApiProperty({ description: 'ID do produtor dono da safra' })
  producerId: number;

  @ApiProperty({ type: () => Producer })
  producer: Partial<Producer>;

  @ApiProperty({ type: () => [AreaInHarvestEntity] })
  areas: AreaInHarvestEntity[];

  @ApiProperty({ type: () => [PlantingInHarvestEntity] })
  plantings: PlantingInHarvestEntity[];

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-01',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2024-01-01',
  })
  updatedAt: Date;

constructor(partial: Partial<HarvestEntity>) {
  Object.assign(this, partial);

  if (partial.producer) {
    this.producer = new Producer(partial.producer);
  }

  if (partial.areas) {
    this.areas = partial.areas.map(a => new AreaInHarvestEntity(a));
  }

  if (partial.plantings) {
    this.plantings = partial.plantings.map(p => new PlantingInHarvestEntity(p));
  }
}
}