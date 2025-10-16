import { Test, TestingModule } from '@nestjs/testing';
import { SoilTypesService } from './soil-types.service';
import { SoilTypesRepository } from './soil-types.repository';
import { AreasRepository } from '../areas/areas.repository';
import { SoilTypesDto } from './dto/soil-types.dto';

describe('SoilTypesService', () => {
  let service: SoilTypesService;

  const mockSoilTypesRepository = {
    create: jest.fn(),
    findById: jest.fn(),
  };

  const mockAreasRepository = {
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SoilTypesService,
        {
          provide: SoilTypesRepository,
          useValue: mockSoilTypesRepository,
        },
        {
          provide: AreasRepository,
          useValue: mockAreasRepository,
        },
      ],
    }).compile();

    service = module.get<SoilTypesService>(SoilTypesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      mockSoilTypesRepository.create.mockResolvedValue(expectedResult);

      const result = await service.create(createDto);

      expect(mockSoilTypesRepository.create).toHaveBeenCalledWith({
        name: 'Solo argiloso',
        description: 'Descrição do solo argiloso',
      });
      expect(mockSoilTypesRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should create a new soil type with null description', async () => {
      const createDto: SoilTypesDto = {
        name: 'Solo argiloso',
        description: null,
      };

      const expectedResult = {
        id: 1,
        name: 'Solo argiloso',
        description: null,
      };

      mockSoilTypesRepository.create.mockResolvedValue(expectedResult);

      const result = await service.create(createDto);

      expect(mockSoilTypesRepository.create).toHaveBeenCalledWith({
        name: 'Solo argiloso',
        description: undefined,
      });
      expect(mockSoilTypesRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should handle repository errors', async () => {
      const createDto: SoilTypesDto = {
        name: 'Solo argiloso',
        description: 'Descrição do solo argiloso',
      };

      const error = new Error('Database connection failed');
      mockSoilTypesRepository.create.mockRejectedValue(error);

      await expect(service.create(createDto)).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockSoilTypesRepository.create).toHaveBeenCalledWith({
        name: 'Solo argiloso',
        description: 'Descrição do solo argiloso',
      });
    });
  });
});
