// src/areas/dto/area-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class AreaResponseDto {
  @ApiProperty({ description: 'ID único da área', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome da área', example: 'Talhão 1' })
  name: string;

  @ApiProperty({ example: '#34A853', description: 'Cor da área' })
  color: string;

  @ApiProperty({
    description: 'Polígono da área (GeoJSON)',
    type: 'object',
    additionalProperties: true,
    example: {
      type: 'Polygon',
      coordinates: [
        [
          [-51.21, -30.03],
          [-51.2, -30.03],
          [-51.2, -30.02],
          [-51.21, -30.02],
          [-51.21, -30.03],
        ],
      ],
    },
  })
  polygon: Record<string, any>;

  @ApiProperty({
    description: 'Tamanho da área em metros quadrados (m²)',
    example: 15700.5,
  })
  areaM2: number;

  @ApiProperty({
    description: 'Data de criação',
    example: '2025-09-09T10:38:21Z',
  })
  createdAt: Date;

  @ApiProperty({ description: 'Área está ativa?', example: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2025-09-09T10:38:21Z',
  })
  updatedAt: Date;

  @ApiProperty({ description: 'ID do produtor', example: 1 })
  producerId: number;

  @ApiProperty({ description: 'ID do tipo de solo', example: 1 })
  soilTypeId: number;

  @ApiProperty({ description: 'ID do tipo de irrigação', example: 1 })
  irrigationTypeId: number;

  @ApiProperty({
    description: 'Informações do tipo de solo',
    required: false,
  })
  soilType?: { id: number; name: string };

  @ApiProperty({
    description: 'Informações do tipo de irrigação',
    required: false,
  })
  irrigationType?: { id: number; name: string };

  constructor(partial: Partial<AreaResponseDto>) {
    Object.assign(this, partial);
  }
}
