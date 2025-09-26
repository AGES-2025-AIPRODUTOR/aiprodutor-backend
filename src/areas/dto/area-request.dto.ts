import { IsInt, IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsGeoJSONPolygon } from './is-geojson-polygon.validator';

export class AreaRequestDto {
  @ApiProperty({
    example: 'Área de Tomates Safra 2025',
    description: 'Nome da área de plantio',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1, description: 'ID do produtor' })
  @IsInt()
  @IsNotEmpty()
  producerId: number;

  @ApiProperty({ example: 1, description: 'ID do tipo de solo' })
  @IsInt()
  @IsNotEmpty()
  soilTypeId: number;

  @ApiProperty({ example: 1, description: 'ID do tipo de irrigação' })
  @IsInt()
  @IsNotEmpty()
  irrigationTypeId: number;

  @ApiProperty({
    description: 'Tamanho da área em metros quadrados (m²)',
  })
  @IsNumber()
  @IsNotEmpty()
  areaM2: number;

  @ApiProperty({
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
    description: 'Polígono GeoJSON representando a área',
  })
  @IsNotEmpty()
  @IsGeoJSONPolygon({
    message: 'O campo polygon deve ser um GeoJSON Polygon válido.',
  })
  polygon: Record<string, any>;
}