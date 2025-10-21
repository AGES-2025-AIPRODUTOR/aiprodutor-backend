import { validate } from 'class-validator';
import { AreaRequestDto } from './area-request.dto';

// Mock do geojson-validation com isPolygon
jest.mock('geojson-validation', () => ({
  default: {
    isPolygon: jest.fn(),
  },
  isPolygon: jest.fn(),
}));

import * as geojsonValidation from 'geojson-validation';
describe('AreaRequestDto', () => {
  let dto: AreaRequestDto;

  const setupValidPolygon = () => {
    return {
      type: 'Polygon',
      coordinates: [
        [
          [-46.6333, -23.5505],
          [-46.633, -23.5505],
          [-46.633, -23.5508],
          [-46.6333, -23.5508],
          [-46.6333, -23.5505],
        ],
      ],
    };
  };

  const setupValidDto = () => {
    dto.name = 'Área de Teste';
    dto.producerId = 1;
    dto.soilTypeId = 1;
    dto.irrigationTypeId = 1;
    dto.areaM2 = 15700.5;
    dto.color = '#34A853';
    dto.polygon = setupValidPolygon();
  };

  beforeEach(() => {
    dto = new AreaRequestDto();
    jest.clearAllMocks();
    // Mock isPolygon to return true by default
    (geojsonValidation.isPolygon as jest.Mock).mockReturnValue(true);
  });

  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      setupValidDto();
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation when name is undefined', async () => {
      setupValidDto();
      (dto as any).name = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'name')).toBe(true);
    });

    it('should fail validation when name is empty string', async () => {
      setupValidDto();
      dto.name = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'name')).toBe(true);
    });

    it('should fail validation when producerId is undefined', async () => {
      setupValidDto();
      (dto as any).producerId = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'producerId')).toBe(
        true,
      );
    });

    it('should fail validation when producerId is not an integer', async () => {
      setupValidDto();
      dto.producerId = 1.5;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'producerId')).toBe(
        true,
      );
    });

    it('should fail validation when soilTypeId is undefined', async () => {
      setupValidDto();
      (dto as any).soilTypeId = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'soilTypeId')).toBe(
        true,
      );
    });

    it('should fail validation when irrigationTypeId is undefined', async () => {
      setupValidDto();
      (dto as any).irrigationTypeId = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.some((error) => error.property === 'irrigationTypeId'),
      ).toBe(true);
    });

    it('should fail validation when color is undefined', async () => {
      setupValidDto();
      (dto as any).color = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'color')).toBe(true);
    });

    it('should fail validation when color is empty string', async () => {
      setupValidDto();
      dto.color = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'color')).toBe(true);
    });

    it('should fail validation when areaM2 is undefined', async () => {
      setupValidDto();
      (dto as any).areaM2 = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'areaM2')).toBe(true);
    });

    it('should fail validation when areaM2 is negative', async () => {
      setupValidDto();
      dto.areaM2 = -100;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'areaM2')).toBe(true);
    });

    it('should fail validation when areaM2 is zero', async () => {
      setupValidDto();
      dto.areaM2 = 0;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'areaM2')).toBe(true);
    });

    it('should fail validation when polygon is undefined', async () => {
      setupValidDto();
      (dto as any).polygon = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'polygon')).toBe(true);
    });

    it('should fail validation when polygon is null', async () => {
      setupValidDto();
      (dto as any).polygon = null;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'polygon')).toBe(true);
    });

    it('should fail validation when polygon is invalid geojson', async () => {
      setupValidDto();
      dto.polygon = { type: 'InvalidType' };
      (geojsonValidation.isPolygon as jest.Mock).mockReturnValue(false);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'polygon')).toBe(true);
    });

    it('should fail validation when multiple fields are invalid', async () => {
      dto.name = '';
      (dto as any).producerId = undefined;
      (dto as any).soilTypeId = undefined;
      (dto as any).irrigationTypeId = undefined;
      dto.color = '';
      dto.areaM2 = 0;
      (dto as any).polygon = null;

      const errors = await validate(dto);
      expect(errors.length).toBe(7);

      const errorProperties = errors.map((error) => error.property);
      expect(errorProperties).toContain('name');
      expect(errorProperties).toContain('producerId');
      expect(errorProperties).toContain('soilTypeId');
      expect(errorProperties).toContain('irrigationTypeId');
      expect(errorProperties).toContain('color');
      expect(errorProperties).toContain('areaM2');
      expect(errorProperties).toContain('polygon');
    });
  });
});
