import { ApiProperty } from '@nestjs/swagger';

export class Area {
  @ApiProperty({ description: 'ID único da área', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome da área', example: 'Talhão 1' })
  name: string;

  @ApiProperty({
    description: 'Polígono da área (GeoJSON)',
    example: { type: 'Polygon', coordinates: [ [ [0,0], [1,1], [1,0], [0,0] ] ] },
    type: 'object',
    properties: {},
    additionalProperties: true,
  })
  polygon: Record<string, any>;

  @ApiProperty({ description: 'Data de criação', example: '2025-08-25T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Status da área', example: 'ativo' })
  status: string;

  @ApiProperty({ description: 'Data de atualização', example: '2025-08-25T12:00:00Z' })
  updatedAt: Date;

  @ApiProperty({ description: 'ID do produtor', example: 1 })
  producerId: number;

  @ApiProperty({ description: 'ID do tipo de solo', example: 1 })
  soilTypeId: number;

  @ApiProperty({ description: 'ID do tipo de irrigação', example: 1 })
  irrigationTypeId: number;

  constructor(partial: Partial<Area>) {
    Object.assign(this, partial);
  }
}
