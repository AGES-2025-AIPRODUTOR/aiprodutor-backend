import { Test, TestingModule } from '@nestjs/testing';
import { IrrigationTypesController } from './irrigation-types.controller';
import { IrrigationTypesService } from './irrigation-types.service';
import { IrrigationTypesDto } from './dto/irrigation-types.dto';

describe('IrrigationTypesController', () => {
  let controller: IrrigationTypesController;

  const mockIrrigationTypesService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IrrigationTypesController],
      providers: [
        {
          provide: IrrigationTypesService,
          useValue: mockIrrigationTypesService,
        },
      ],
    }).compile();

    controller = module.get<IrrigationTypesController>(
      IrrigationTypesController,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new irrigation type successfully', async () => {
      const createDto: IrrigationTypesDto = {
        name: 'Irrigação por gotejamento',
        description: 'Descrição da irrigação por gotejamento',
      };

      const expectedResult = {
        id: 1,
        name: 'Irrigação por gotejamento',
        description: 'Descrição da irrigação por gotejamento',
      };

      mockIrrigationTypesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(mockIrrigationTypesService.create).toHaveBeenCalledWith(createDto);
      expect(mockIrrigationTypesService.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should handle service errors', async () => {
      const createDto: IrrigationTypesDto = {
        name: 'Irrigação por gotejamento',
        description: 'Descrição da irrigação por gotejamento',
      };

      const error = new Error('Database error');
      mockIrrigationTypesService.create.mockRejectedValue(error);

      await expect(controller.create(createDto)).rejects.toThrow(
        'Database error',
      );
      expect(mockIrrigationTypesService.create).toHaveBeenCalledWith(createDto);
    });
  });
});
