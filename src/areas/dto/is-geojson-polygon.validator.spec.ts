import { validateSync } from 'class-validator';
import { IsGeoJSONPolygon } from './is-geojson-polygon.validator';
import geojsonValidation from 'geojson-validation';

jest.mock('geojson-validation', () => ({
  isPolygon: jest.fn(),
}));

class TestDto {
  @IsGeoJSONPolygon({ message: 'O campo polygon deve ser um GeoJSON Polygon válido.' })
  polygon: any;
}

describe('IsGeoJSONPolygon Validator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validation', () => {
    it('should pass validation for valid GeoJSON Polygon', () => {
      const validPolygon = {
        type: 'Polygon',
        coordinates: [
          [
            [-51.92528, -14.235004],
            [-51.92528, -14.235005],
            [-51.92529, -14.235005],
            [-51.92529, -14.235004],
            [-51.92528, -14.235004],
          ],
        ],
      };
      (geojsonValidation.isPolygon as jest.Mock).mockReturnValue(true);

      const testDto = new TestDto();
      testDto.polygon = validPolygon;

      const errors = validateSync(testDto);

      expect(geojsonValidation.isPolygon).toHaveBeenCalledWith(validPolygon);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation for valid GeoJSON Polygon with hole', () => {
      const polygonWithHole = {
        type: 'Polygon',
        coordinates: [
          // Exterior ring
          [
            [-51.92600, -14.23400],
            [-51.92600, -14.23600],
            [-51.92400, -14.23600],
            [-51.92400, -14.23400],
            [-51.92600, -14.23400],
          ],
          // Interior ring (hole)
          [
            [-51.92550, -14.23450],
            [-51.92550, -14.23550],
            [-51.92450, -14.23550],
            [-51.92450, -14.23450],
            [-51.92550, -14.23450],
          ],
        ],
      };
      (geojsonValidation.isPolygon as jest.Mock).mockReturnValue(true);

      const testDto = new TestDto();
      testDto.polygon = polygonWithHole;

      const errors = validateSync(testDto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation for invalid GeoJSON Polygon (Point type)', () => {
      const invalidPolygon = {
        type: 'Point',
        coordinates: [-51.92528, -14.235004],
      };

      const testDto = new TestDto();
      testDto.polygon = invalidPolygon;

      const errors = validateSync(testDto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('polygon');
      expect(errors[0].constraints?.isGeoJSONPolygon).toBe('O campo polygon deve ser um GeoJSON Polygon válido.');
    });

    it('should fail validation for null value', () => {
      const testDto = new TestDto();
      testDto.polygon = null;

      const errors = validateSync(testDto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('polygon');
      expect(errors[0].constraints?.isGeoJSONPolygon).toBe('O campo polygon deve ser um GeoJSON Polygon válido.');
    });

    it('should fail validation for undefined value', () => {
      const testDto = new TestDto();
      testDto.polygon = undefined;

      const errors = validateSync(testDto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('polygon');
      expect(errors[0].constraints?.isGeoJSONPolygon).toBe('O campo polygon deve ser um GeoJSON Polygon válido.');
    });

    it('should fail validation for empty object', () => {
      const emptyObject = {};

      const testDto = new TestDto();
      testDto.polygon = emptyObject;

      const errors = validateSync(testDto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('polygon');
      expect(errors[0].constraints?.isGeoJSONPolygon).toBe('O campo polygon deve ser um GeoJSON Polygon válido.');
    });

    it('should fail validation for empty coordinates array', () => {
      const emptyCoordinates = {
        type: 'Polygon',
        coordinates: [],
      };

      const testDto = new TestDto();
      testDto.polygon = emptyCoordinates;

      const errors = validateSync(testDto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('polygon');
      expect(errors[0].constraints?.isGeoJSONPolygon).toBe('O campo polygon deve ser um GeoJSON Polygon válido.');
    });

    it('should fail validation for coordinates with empty inner array', () => {
      const emptyInnerArray = {
        type: 'Polygon',
        coordinates: [[]],
      };

      const testDto = new TestDto();
      testDto.polygon = emptyInnerArray;

      const errors = validateSync(testDto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('polygon');
      expect(errors[0].constraints?.isGeoJSONPolygon).toBe('O campo polygon deve ser um GeoJSON Polygon válido.');
    });

    it('should fail validation for polygon with invalid coordinates (incomplete)', () => {
      const invalidPolygon = {
        type: 'Polygon',
        coordinates: [
          [
            [-51.92528], // coordenada incompleta
            [-51.92528, -14.235005],
            [-51.92529, -14.235005],
            [-51.92529, -14.235004],
          ],
        ],
      };

      const testDto = new TestDto();
      testDto.polygon = invalidPolygon;

      const errors = validateSync(testDto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('polygon');
      expect(errors[0].constraints?.isGeoJSONPolygon).toBe('O campo polygon deve ser um GeoJSON Polygon válido.');
    });

    it('should fail validation for polygon with unclosed ring', () => {
      const unclosedPolygon = {
        type: 'Polygon',
        coordinates: [
          [
            [-51.92528, -14.235004],
            [-51.92528, -14.235005],
            [-51.92529, -14.235005],
            [-51.92529, -14.235004],
            // falta fechar
          ],
        ],
      };

      const testDto = new TestDto();
      testDto.polygon = unclosedPolygon;

      const errors = validateSync(testDto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('polygon');
      expect(errors[0].constraints?.isGeoJSONPolygon).toBe('O campo polygon deve ser um GeoJSON Polygon válido.');
    });

    it('should fail validation for coordinates out of geographic range (longitude)', () => {
      const outOfRangeLongitude = {
        type: 'Polygon',
        coordinates: [
          [
            [-200, -14.235004], // longitude fora do range
            [-51.92528, -14.235005],
            [-51.92529, -14.235005],
            [-51.92529, -14.235004],
            [-200, -14.235004],
          ],
        ],
      };

      const testDto = new TestDto();
      testDto.polygon = outOfRangeLongitude;

      const errors = validateSync(testDto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('polygon');
      expect(errors[0].constraints?.isGeoJSONPolygon).toBe('O campo polygon deve ser um GeoJSON Polygon válido.');
    });

    it('should fail validation for coordinates out of geographic range (latitude)', () => {
      const outOfRangeLatitude = {
        type: 'Polygon',
        coordinates: [
          [
            [-51.92528, -95], // latitude fora do range
            [-51.92528, -14.235005],
            [-51.92529, -14.235005],
            [-51.92529, -14.235004],
            [-51.92528, -95],
          ],
        ],
      };

      const testDto = new TestDto();
      testDto.polygon = outOfRangeLatitude;

      const errors = validateSync(testDto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('polygon');
      expect(errors[0].constraints?.isGeoJSONPolygon).toBe('O campo polygon deve ser um GeoJSON Polygon válido.');
    });

    it('should fail validation for coordinates with non-numeric values', () => {
      const nonNumericCoords = {
        type: 'Polygon',
        coordinates: [
          [
            ['invalid', 'invalid'],
            [-51.92528, -14.235005],
            [-51.92529, -14.235005],
            [-51.92529, -14.235004],
            [-51.92528, -14.235004],
          ],
        ],
      };

      const testDto = new TestDto();
      testDto.polygon = nonNumericCoords;

      const errors = validateSync(testDto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('polygon');
      expect(errors[0].constraints?.isGeoJSONPolygon).toBe('O campo polygon deve ser um GeoJSON Polygon válido.');
    });

    it('should fail validation for polygon with insufficient points', () => {
      const insufficientPoints = {
        type: 'Polygon',
        coordinates: [
          [
            [-51.92528, -14.235004],
            [-51.92528, -14.235005],
            [-51.92528, -14.235004], // apenas 3 pontos
          ],
        ],
      };

      const testDto = new TestDto();
      testDto.polygon = insufficientPoints;

      const errors = validateSync(testDto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('polygon');
      expect(errors[0].constraints?.isGeoJSONPolygon).toBe('O campo polygon deve ser um GeoJSON Polygon válido.');
    });

    it('should fail validation for coordinates as string', () => {
      const coordinatesAsString = {
        type: 'Polygon',
        coordinates: 'invalid',
      };

      const testDto = new TestDto();
      testDto.polygon = coordinatesAsString;

      const errors = validateSync(testDto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('polygon');
      expect(errors[0].constraints?.isGeoJSONPolygon).toBe('O campo polygon deve ser um GeoJSON Polygon válido.');
    });

    it('should fail validation for lowercase type', () => {
      const lowercaseType = {
        type: 'polygon', // minúscula
        coordinates: [
          [
            [-51.92528, -14.235004],
            [-51.92528, -14.235005],
            [-51.92529, -14.235005],
            [-51.92529, -14.235004],
            [-51.92528, -14.235004],
          ],
        ],
      };

      const testDto = new TestDto();
      testDto.polygon = lowercaseType;

      const errors = validateSync(testDto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('polygon');
      expect(errors[0].constraints?.isGeoJSONPolygon).toBe('O campo polygon deve ser um GeoJSON Polygon válido.');
    });

    it('should fail validation for MultiPolygon type', () => {
      const multiPolygon = {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [-51.92528, -14.235004],
              [-51.92528, -14.235005],
              [-51.92529, -14.235005],
              [-51.92529, -14.235004],
              [-51.92528, -14.235004],
            ],
          ],
        ],
      };

      const testDto = new TestDto();
      testDto.polygon = multiPolygon;

      const errors = validateSync(testDto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('polygon');
      expect(errors[0].constraints?.isGeoJSONPolygon).toBe('O campo polygon deve ser um GeoJSON Polygon válido.');
    });

    it('should pass validation for polygon with 3D coordinates', () => {
      const threeDimensional = {
        type: 'Polygon',
        coordinates: [
          [
            [-51.92528, -14.235004, 100], // com elevação
            [-51.92528, -14.235005, 101],
            [-51.92529, -14.235005, 102],
            [-51.92529, -14.235004, 103],
            [-51.92528, -14.235004, 100],
          ],
        ],
      };
      (geojsonValidation.isPolygon as jest.Mock).mockReturnValue(true);

      const testDto = new TestDto();
      testDto.polygon = threeDimensional;

      const errors = validateSync(testDto);

      expect(errors).toHaveLength(0);
    });

    it('should handle geojson-validation library errors gracefully', () => {
      const validPolygon = {
        type: 'Polygon',
        coordinates: [
          [
            [-51.92528, -14.235004],
            [-51.92528, -14.235005],
            [-51.92529, -14.235005],
            [-51.92529, -14.235004],
            [-51.92528, -14.235004],
          ],
        ],
      };
      // Simular erro na biblioteca
      (geojsonValidation.isPolygon as jest.Mock).mockImplementation(() => {
        throw new Error('Library error');
      });

      const testDto = new TestDto();
      testDto.polygon = validPolygon;

      const errors = validateSync(testDto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('polygon');
      expect(errors[0].constraints?.isGeoJSONPolygon).toBe('O campo polygon deve ser um GeoJSON Polygon válido.');
    });
  });
});
