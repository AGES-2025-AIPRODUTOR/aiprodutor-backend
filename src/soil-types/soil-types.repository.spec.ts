import { Test, TestingModule } from '@nestjs/testing';
import { SoilTypesRepository } from './soil-types.repository';
import { PrismaService } from '../shared/prisma/prisma.service';

describe('SoilTypesRepository', () => {
  let repository: SoilTypesRepository;

  const mockPrismaService = {
    soilType: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SoilTypesRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<SoilTypesRepository>(SoilTypesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new soil type successfully', async () => {
      const createData = {
        name: 'Solo argiloso',
        description: 'Descrição do solo argiloso',
      };

      const expectedResult = {
        id: 1,
        name: 'Solo argiloso',
        description: 'Descrição do solo argiloso',
      };

      mockPrismaService.soilType.create.mockResolvedValue(expectedResult);

      const result = await repository.create(createData);

      expect(mockPrismaService.soilType.create).toHaveBeenCalledWith({
        data: createData,
      });
      expect(mockPrismaService.soilType.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should create a new soil type with optional description', async () => {
      const createData = {
        name: 'Solo argiloso',
      };

      const expectedResult = {
        id: 1,
        name: 'Solo argiloso',
        description: null,
      };

      mockPrismaService.soilType.create.mockResolvedValue(expectedResult);

      const result = await repository.create(createData);

      expect(mockPrismaService.soilType.create).toHaveBeenCalledWith({
        data: createData,
      });
      expect(mockPrismaService.soilType.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should handle database errors', async () => {
      const createData = {
        name: 'Solo argiloso',
        description: 'Descrição do solo argiloso',
      };

      const error = new Error('Database constraint violation');
      mockPrismaService.soilType.create.mockRejectedValue(error);

      await expect(repository.create(createData)).rejects.toThrow(
        'Database constraint violation',
      );
      expect(mockPrismaService.soilType.create).toHaveBeenCalledWith({
        data: createData,
      });
    });
  });

  describe('findById', () => {
    it('should find soil type by id successfully', async () => {
      const id = 1;
      const expectedResult = {
        id: 1,
        name: 'Solo argiloso',
        description: 'Descrição do solo argiloso',
      };

      mockPrismaService.soilType.findUnique.mockResolvedValue(expectedResult);

      const result = await repository.findById(id);

      expect(mockPrismaService.soilType.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(mockPrismaService.soilType.findUnique).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should return null when soil type is not found', async () => {
      const id = 999;

      mockPrismaService.soilType.findUnique.mockResolvedValue(null);

      const result = await repository.findById(id);

      expect(mockPrismaService.soilType.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toBeNull();
    });
  });
});
