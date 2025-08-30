import { validate } from 'class-validator';
import { AreaRequestDto } from './area-request.dto';

// Mock do geojsonValidation
jest.mock('geojson-validation', () => ({
  isPolygon: jest.fn(),
}));

import geojsonValidation from 'geojson-validation';

describe('AreaRequestDto', () => {
  let dto: AreaRequestDto;

  // Função helper para setup de polígono válido
  const setupValidPolygon = () => {
    (geojsonValidation.isPolygon as jest.Mock).mockReturnValue(true);
    return {
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
  };

  beforeEach(() => {
    dto = new AreaRequestDto();
    // Reset dos mocks
    jest.clearAllMocks();
  });

  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      dto.name = 'Área de Teste';
      dto.producerId = 1;
      dto.soilTypeId = 1;
      dto.irrigationTypeId = 1;
      dto.polygon = setupValidPolygon();

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
      expect(geojsonValidation.isPolygon).toHaveBeenCalledWith(dto.polygon);
    });

    describe('name field', () => {
      it('should fail validation when name is empty', async () => {
        dto.name = '';
        dto.producerId = 1;
        dto.soilTypeId = 1;
        dto.irrigationTypeId = 1;
        dto.polygon = setupValidPolygon();

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('name');
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('should fail validation when name is not a string', async () => {
        dto.name = 123 as any;
        dto.producerId = 1;
        dto.soilTypeId = 1;
        dto.irrigationTypeId = 1;
        dto.polygon = setupValidPolygon();

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('name');
        expect(errors[0].constraints).toHaveProperty('isString');
      });

      it('should fail validation when name is undefined', async () => {
        dto.producerId = 1;
        dto.soilTypeId = 1;
        dto.irrigationTypeId = 1;
        dto.polygon = setupValidPolygon();

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('name');
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('producerId field', () => {
      it('should fail validation when producerId is not an integer', async () => {
        dto.name = 'Área de Teste';
        dto.producerId = 'not a number' as any;
        dto.soilTypeId = 1;
        dto.irrigationTypeId = 1;
        dto.polygon = setupValidPolygon();

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('producerId');
        expect(errors[0].constraints).toHaveProperty('isInt');
      });

      it('should fail validation when producerId is undefined', async () => {
        dto.name = 'Área de Teste';
        dto.soilTypeId = 1;
        dto.irrigationTypeId = 1;
        dto.polygon = setupValidPolygon();

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('producerId');
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('should fail validation when producerId is a float', async () => {
        dto.name = 'Área de Teste';
        dto.producerId = 1.5;
        dto.soilTypeId = 1;
        dto.irrigationTypeId = 1;
        dto.polygon = setupValidPolygon();

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('producerId');
        expect(errors[0].constraints).toHaveProperty('isInt');
      });
    });

    describe('soilTypeId field', () => {
      it('should fail validation when soilTypeId is not an integer', async () => {
        dto.name = 'Área de Teste';
        dto.producerId = 1;
        dto.soilTypeId = 'not a number' as any;
        dto.irrigationTypeId = 1;
        dto.polygon = setupValidPolygon();

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('soilTypeId');
        expect(errors[0].constraints).toHaveProperty('isInt');
      });

      it('should fail validation when soilTypeId is undefined', async () => {
        dto.name = 'Área de Teste';
        dto.producerId = 1;
        dto.irrigationTypeId = 1;
        dto.polygon = setupValidPolygon();

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('soilTypeId');
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('irrigationTypeId field', () => {
      it('should fail validation when irrigationTypeId is not an integer', async () => {
        dto.name = 'Área de Teste';
        dto.producerId = 1;
        dto.soilTypeId = 1;
        dto.irrigationTypeId = 'not a number' as any;
        dto.polygon = setupValidPolygon();

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('irrigationTypeId');
        expect(errors[0].constraints).toHaveProperty('isInt');
      });

      it('should fail validation when irrigationTypeId is undefined', async () => {
        dto.name = 'Área de Teste';
        dto.producerId = 1;
        dto.soilTypeId = 1;
        dto.polygon = setupValidPolygon();

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('irrigationTypeId');
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('polygon field', () => {
      it('should fail validation when polygon is undefined', async () => {
        dto.name = 'Área de Teste';
        dto.producerId = 1;
        dto.soilTypeId = 1;
        dto.irrigationTypeId = 1;

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('polygon');
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('should fail validation when polygon is null', async () => {
        (geojsonValidation.isPolygon as jest.Mock).mockReturnValue(false);
        
        dto.name = 'Área de Teste';
        dto.producerId = 1;
        dto.soilTypeId = 1;
        dto.irrigationTypeId = 1;
        dto.polygon = null as any;

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('polygon');
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });

      it('should fail validation when polygon is empty object', async () => {
        (geojsonValidation.isPolygon as jest.Mock).mockReturnValue(false);
        
        dto.name = 'Área de Teste';
        dto.producerId = 1;
        dto.soilTypeId = 1;
        dto.irrigationTypeId = 1;
        dto.polygon = {};

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('polygon');
        expect(errors[0].constraints).toHaveProperty('isGeoJSONPolygon');
        // Nota: geojsonValidation.isPolygon não é chamado para objetos vazios, pois nosso validador rejeita antes
      });
    });

    it('should fail validation with multiple field errors', async () => {
      (geojsonValidation.isPolygon as jest.Mock).mockReturnValue(false);
      
      dto.name = '';
      dto.producerId = 'invalid' as any;
      dto.soilTypeId = 'invalid' as any;
      dto.irrigationTypeId = 'invalid' as any;
      dto.polygon = null as any;

      const errors = await validate(dto);

      expect(errors).toHaveLength(5); // name, producerId, soilTypeId, irrigationTypeId, polygon
      
      const errorProperties = errors.map(error => error.property);
      expect(errorProperties).toContain('name');
      expect(errorProperties).toContain('producerId');
      expect(errorProperties).toContain('soilTypeId');
      expect(errorProperties).toContain('irrigationTypeId');
      expect(errorProperties).toContain('polygon');
    });
  });
});
