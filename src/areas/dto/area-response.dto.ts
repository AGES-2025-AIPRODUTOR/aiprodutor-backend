import { ApiProperty } from '@nestjs/swagger';

export class AreaResponseDto {
  @ApiProperty({ description: 'ID único da área', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome da área', example: 'Talhão 1' })
  name: string;

  @ApiProperty({
    description: 'Polígono da área (GeoJSON)',
    example: {
      type: 'Polygon',
      coordinates: [
        [
          [0, 0],
          [1, 1],
          [1, 0],
          [0, 0],
        ],
      ],
    },
    type: 'object',
    additionalProperties: true,
  })
  polygon: Record<string, any>;

  @ApiProperty({
    description: 'Tamanho da área em hectares',
    example: 15.7,
    required: false,
  })
  areaSize?: number;

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

  constructor(partial: Partial<AreaResponseDto & { areaSize: number }>) {
    Object.assign(this, partial);

    // Converte a área de metros quadrados (vindo do DB) para hectares,
    // arredondando para 2 casas decimais.
    if (this.areaSize) {
      this.areaSize = parseFloat((this.areaSize / 10000).toFixed(2));
    }
  }
}
