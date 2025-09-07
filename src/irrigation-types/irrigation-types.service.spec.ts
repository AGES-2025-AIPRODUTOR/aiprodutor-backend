import { Test, TestingModule } from '@nestjs/testing';
import { IrrigationTypesService } from './irrigation-types.service';
import { IrrigationTypesRepository } from './irrigation-types.repository';
import { IrrigationTypesDto } from './dto/irrigation-types.dto';

describe('IrrigationTypesService', () => {
  let service: IrrigationTypesService;

  const mockIrrigationTypesRepository = {
    create: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IrrigationTypesService,
        {
          provide: IrrigationTypesRepository,
          useValue: mockIrrigationTypesRepository,
        },
      ],
    }).compile();

    service = module.get<IrrigationTypesService>(IrrigationTypesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      mockIrrigationTypesRepository.create.mockResolvedValue(expectedResult);

      const result = await service.create(createDto);

      expect(mockIrrigationTypesRepository.create).toHaveBeenCalledWith(
        createDto,
      );
      expect(mockIrrigationTypesRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should handle repository errors', async () => {
      const createDto: IrrigationTypesDto = {
        name: 'Irrigação por gotejamento',
        description: 'Descrição da irrigação por gotejamento',
      };

      const error = new Error('Database connection failed');
      mockIrrigationTypesRepository.create.mockRejectedValue(error);

      await expect(service.create(createDto)).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockIrrigationTypesRepository.create).toHaveBeenCalledWith(
        createDto,
      );
    });
  });
});
