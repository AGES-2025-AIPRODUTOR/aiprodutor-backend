import { Test, TestingModule } from '@nestjs/testing';
import { IrrigationTypesRepository } from './irrigation-types.repository';
import { PrismaService } from '../shared/prisma/prisma.service';

describe('IrrigationTypesRepository', () => {
  let repository: IrrigationTypesRepository;

  const mockPrismaService = {
    irrigationType: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IrrigationTypesRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<IrrigationTypesRepository>(
      IrrigationTypesRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new irrigation type successfully', async () => {
      const createData = {
        name: 'Irrigação por gotejamento',
        description: 'Descrição da irrigação por gotejamento',
      };

      const expectedResult = {
        id: 1,
        name: 'Irrigação por gotejamento',
        description: 'Descrição da irrigação por gotejamento',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.irrigationType.create.mockResolvedValue(expectedResult);

      const result = await repository.create(createData);

      expect(mockPrismaService.irrigationType.create).toHaveBeenCalledWith({
        data: createData,
      });
      expect(mockPrismaService.irrigationType.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should handle database errors', async () => {
      const createData = {
        name: 'Irrigação por gotejamento',
        description: 'Descrição da irrigação por gotejamento',
      };

      const error = new Error('Database constraint violation');
      mockPrismaService.irrigationType.create.mockRejectedValue(error);

      await expect(repository.create(createData)).rejects.toThrow(
        'Database constraint violation',
      );
      expect(mockPrismaService.irrigationType.create).toHaveBeenCalledWith({
        data: createData,
      });
    });
  });

  describe('findById', () => {
    it('should find irrigation type by id successfully', async () => {
      const id = 1;
      const expectedResult = {
        id: 1,
        name: 'Irrigação por gotejamento',
        description: 'Descrição da irrigação por gotejamento',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.irrigationType.findUnique.mockResolvedValue(
        expectedResult,
      );

      const result = await repository.findById(id);

      expect(mockPrismaService.irrigationType.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(mockPrismaService.irrigationType.findUnique).toHaveBeenCalledTimes(
        1,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should return null when irrigation type is not found', async () => {
      const id = 999;

      mockPrismaService.irrigationType.findUnique.mockResolvedValue(null);

      const result = await repository.findById(id);

      expect(mockPrismaService.irrigationType.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toBeNull();
    });
  });
});
