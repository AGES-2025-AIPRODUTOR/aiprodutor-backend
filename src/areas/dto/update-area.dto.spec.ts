import { validate } from 'class-validator';
import { UpdateAreaDto } from './update-area.dto';

describe('UpdateAreaDto', () => {
  let dto: UpdateAreaDto;

  beforeEach(() => {
    dto = new UpdateAreaDto();
  });

  describe('validation', () => {
    it('should pass validation with all valid fields', async () => {
      dto.name = 'Nova Área';
      dto.soilTypeId = 1;
      dto.irrigationTypeId = 2;
      dto.isActive = true;

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should pass validation with empty object (all fields optional)', async () => {
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    describe('name field', () => {
      it('should pass validation when name is valid string', async () => {
        dto.name = 'Área Atualizada';

        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });

      it('should pass validation when name is undefined', async () => {
        // name fica undefined
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });

      it('should fail validation when name is not a string', async () => {
        dto.name = 123 as any;

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('name');
        expect(errors[0].constraints).toHaveProperty('isString');
      });

      it('should pass validation when name is null (optional field)', async () => {
        dto.name = null as any;

        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });

      it('should fail validation when name is empty string', async () => {
        dto.name = '';

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('name');
        expect(errors[0].constraints).toHaveProperty('isNotEmpty');
      });
    });

    describe('soilTypeId field', () => {
      it('should pass validation when soilTypeId is valid number', async () => {
        dto.soilTypeId = 1;

        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });

      it('should pass validation when soilTypeId is undefined', async () => {
        // soilTypeId fica undefined
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });

      it('should fail validation when soilTypeId is not a number', async () => {
        dto.soilTypeId = 'not a number' as any;

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('soilTypeId');
        expect(errors[0].constraints).toHaveProperty('isNumber');
      });

      it('should pass validation when soilTypeId is null (optional field)', async () => {
        dto.soilTypeId = null as any;

        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });

      it('should pass validation when soilTypeId is zero', async () => {
        dto.soilTypeId = 0;

        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });

      it('should pass validation when soilTypeId is negative', async () => {
        dto.soilTypeId = -1;

        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });
    });

    describe('irrigationTypeId field', () => {
      it('should pass validation when irrigationTypeId is valid number', async () => {
        dto.irrigationTypeId = 1;

        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });

      it('should pass validation when irrigationTypeId is undefined', async () => {
        // irrigationTypeId fica undefined
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });

      it('should fail validation when irrigationTypeId is not a number', async () => {
        dto.irrigationTypeId = 'not a number' as any;

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('irrigationTypeId');
        expect(errors[0].constraints).toHaveProperty('isNumber');
      });

      it('should pass validation when irrigationTypeId is null (optional field)', async () => {
        dto.irrigationTypeId = null as any;

        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });

      it('should pass validation when irrigationTypeId is zero', async () => {
        dto.irrigationTypeId = 0;

        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });
    });

    describe('isActive field', () => {
      it('should pass validation when isActive is true', async () => {
        dto.isActive = true;

        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });

      it('should pass validation when isActive is false', async () => {
        dto.isActive = false;

        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });

      it('should pass validation when isActive is undefined', async () => {
        // isActive fica undefined
        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });

      it('should fail validation when isActive is not a boolean', async () => {
        dto.isActive = 'true' as any;

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('isActive');
        expect(errors[0].constraints).toHaveProperty('isBoolean');
      });

      it('should pass validation when isActive is null (optional field)', async () => {
        dto.isActive = null as any;

        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
      });

      it('should fail validation when isActive is a number', async () => {
        dto.isActive = 1 as any;

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('isActive');
        expect(errors[0].constraints).toHaveProperty('isBoolean');
      });
    });

    it('should fail validation with multiple invalid fields', async () => {
      dto.name = 123 as any;
      dto.soilTypeId = 'invalid' as any;
      dto.irrigationTypeId = 'invalid' as any;
      dto.isActive = 'true' as any;

      const errors = await validate(dto);

      expect(errors).toHaveLength(4);

      const errorProperties = errors.map((error) => error.property);
      expect(errorProperties).toContain('name');
      expect(errorProperties).toContain('soilTypeId');
      expect(errorProperties).toContain('irrigationTypeId');
      expect(errorProperties).toContain('isActive');
    });

    it('should pass validation with partial update (only some fields)', async () => {
      dto.name = 'Apenas nome';

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should pass validation with another partial update', async () => {
      dto.isActive = false;
      dto.soilTypeId = 3;

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });
});
