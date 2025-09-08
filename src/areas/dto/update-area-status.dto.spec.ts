import { validate } from 'class-validator';
import { UpdateAreaStatusDto } from './update-area-status.dto';

describe('UpdateAreaStatusDto', () => {
  let dto: UpdateAreaStatusDto;

  beforeEach(() => {
    dto = new UpdateAreaStatusDto();
  });

  describe('validation', () => {
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

    it('should fail validation when isActive is not a boolean', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      dto.isActive = 'true' as any;

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('isActive');
      expect(errors[0].constraints).toHaveProperty('isBoolean');
    });

    it('should fail validation when isActive is a number', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      dto.isActive = 1 as any;

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('isActive');
      expect(errors[0].constraints).toHaveProperty('isBoolean');
    });

    it('should fail validation when isActive is null', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      dto.isActive = null as any;

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('isActive');
      expect(errors[0].constraints).toHaveProperty('isBoolean');
    });

    it('should fail validation when isActive is undefined', async () => {
      // isActive fica undefined
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('isActive');
      expect(errors[0].constraints).toHaveProperty('isBoolean');
    });

    it('should fail validation when isActive is an object', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      dto.isActive = { active: true } as any;

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('isActive');
      expect(errors[0].constraints).toHaveProperty('isBoolean');
    });

    it('should fail validation when isActive is an array', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      dto.isActive = [true] as any;

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('isActive');
      expect(errors[0].constraints).toHaveProperty('isBoolean');
    });

    it('should fail validation when isActive is empty string', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      dto.isActive = '' as any;

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('isActive');
      expect(errors[0].constraints).toHaveProperty('isBoolean');
    });
  });
});
