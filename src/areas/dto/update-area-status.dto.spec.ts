import { validate } from 'class-validator';
import { UpdateAreaStatusDto } from './update-area-status.dto';

describe('UpdateAreaStatusDto', () => {
  let dto: UpdateAreaStatusDto;

  beforeEach(() => {
    dto = new UpdateAreaStatusDto();
  });

  describe('validation', () => {
    it('should pass validation when ativo is true', async () => {
      dto.ativo = true;

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should pass validation when ativo is false', async () => {
      dto.ativo = false;

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation when ativo is not a boolean', async () => {
      dto.ativo = 'true' as any;

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('ativo');
      expect(errors[0].constraints).toHaveProperty('isBoolean');
    });

    it('should fail validation when ativo is a number', async () => {
      dto.ativo = 1 as any;

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('ativo');
      expect(errors[0].constraints).toHaveProperty('isBoolean');
    });

    it('should fail validation when ativo is null', async () => {
      dto.ativo = null as any;

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('ativo');
      expect(errors[0].constraints).toHaveProperty('isBoolean');
    });

    it('should fail validation when ativo is undefined', async () => {
      // ativo fica undefined
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('ativo');
      expect(errors[0].constraints).toHaveProperty('isBoolean');
    });

    it('should fail validation when ativo is an object', async () => {
      dto.ativo = { active: true } as any;

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('ativo');
      expect(errors[0].constraints).toHaveProperty('isBoolean');
    });

    it('should fail validation when ativo is an array', async () => {
      dto.ativo = [true] as any;

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('ativo');
      expect(errors[0].constraints).toHaveProperty('isBoolean');
    });

    it('should fail validation when ativo is empty string', async () => {
      dto.ativo = '' as any;

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('ativo');
      expect(errors[0].constraints).toHaveProperty('isBoolean');
    });
  });
});
