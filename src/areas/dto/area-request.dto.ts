import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsGeoJSONPolygon } from './is-geojson-polygon.validator';

export class AreaRequestDto {
  @ApiProperty({ example: 'Área 1', description: 'Nome da área de plantio' })
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
    example: {
      type: 'Polygon',
      coordinates: [
        [
          [-51.92528, -14.235004],
          [-51.92528, -14.235005],
          [-51.92529, -14.235005],
          [-51.92529, -14.235004],
        ],
      ],
    },
    description: 'Polígono GeoJSON representando a área',
  })
  @IsNotEmpty()
  @IsGeoJSONPolygon({ message: 'O campo polygon deve ser um GeoJSON Polygon válido.' })
  polygon: Record<string, any>;
}
