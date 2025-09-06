import { Test, TestingModule } from '@nestjs/testing';
import { SoilTypesController } from './soil-types.controller';
import { SoilTypesService } from './soil-types.service';
import { SoilTypesDto } from './dto/soil-types.dto';

describe('SoilTypesController', () => {
  let controller: SoilTypesController;

  const mockSoilTypesService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SoilTypesController],
      providers: [
        {
          provide: SoilTypesService,
          useValue: mockSoilTypesService,
        },
      ],
    }).compile();

    controller = module.get<SoilTypesController>(SoilTypesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new soil type successfully', async () => {
      const createDto: SoilTypesDto = {
        name: 'Solo argiloso',
        description: 'Descrição do solo argiloso',
      };

      const expectedResult = {
        id: 1,
        name: 'Solo argiloso',
        description: 'Descrição do solo argiloso',
      };

      mockSoilTypesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(mockSoilTypesService.create).toHaveBeenCalledWith(createDto);
      expect(mockSoilTypesService.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should handle service errors', async () => {
      const createDto: SoilTypesDto = {
        name: 'Solo argiloso',
        description: 'Descrição do solo argiloso',
      };

      const error = new Error('Database error');
      mockSoilTypesService.create.mockRejectedValue(error);

      await expect(controller.create(createDto)).rejects.toThrow(
        'Database error',
      );
      expect(mockSoilTypesService.create).toHaveBeenCalledWith(createDto);
    });
  });
});
