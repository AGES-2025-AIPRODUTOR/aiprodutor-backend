import { Test, TestingModule } from '@nestjs/testing';
import { AreasRepository } from './areas.repository';
import { PrismaService } from '../shared/prisma/prisma.service';
import { AreaRequestDto } from './dto/area-request.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from 'generated/prisma';

// Type definitions for test data
interface MockAreaFromDatabase {
  id: number;
  name: string;
  producerId: number;
  soilTypeId: number;
  irrigationTypeId: number;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
  polygon: string;
}

interface MockAreaResult {
  id: number;
  name: string;
  ativo: boolean;
  producerId: number;
  soilTypeId: number;
  irrigationTypeId: number;
  createdAt: Date;
  polygon: string;
}

interface MockPrismaService {
  $queryRawUnsafe: jest.MockedFunction<
    (query: string, ...params: any[]) => Promise<any>
  >;
  area: {
    findUnique: jest.MockedFunction<
      (args: any) => Promise<MockAreaFromDatabase | null>
    >;
    update: jest.MockedFunction<(args: any) => Promise<MockAreaFromDatabase>>;
  };
}

// Return type for repository create method
interface AreaCreateResult {
  id: number;
  name: string;
  ativo: boolean;
  producerId: number;
  soilTypeId: number;
  irrigationTypeId: number;
  createdAt: Date;
  polygon?: any;
}

describe('AreasRepository', () => {
  let repository: AreasRepository;

  const mockPrismaService: MockPrismaService = {
    $queryRawUnsafe: jest.fn(),
    area: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockAreaRequestDto: AreaRequestDto = {
    name: 'Área de Teste',
    producerId: 1,
    soilTypeId: 1,
    irrigationTypeId: 1,
    polygon: {
      type: 'Polygon',
      coordinates: [
        [
          [-51.92528, -14.235004],
          [-51.92528, -14.235005],
          [-51.92529, -14.235005],
          [-51.92529, -14.235004],
          [-51.92528, -14.235004],
        ],
      ],
    },
  };

  const mockAreaFromDatabase: MockAreaFromDatabase = {
    id: 1,
    name: 'Área de Teste',
    producerId: 1,
    soilTypeId: 1,
    irrigationTypeId: 1,
    ativo: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    polygon: JSON.stringify(mockAreaRequestDto.polygon),
  };

  const mockAreaResult: MockAreaResult = {
    id: 1,
    name: 'Área de Teste',
    ativo: true,
    producerId: 1,
    soilTypeId: 1,
    irrigationTypeId: 1,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    polygon: JSON.stringify(mockAreaRequestDto.polygon),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AreasRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<AreasRepository>(AreasRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new area successfully', async () => {
      mockPrismaService.$queryRawUnsafe.mockResolvedValue([mockAreaResult]);

      const result = (await repository.create(
        mockAreaRequestDto,
      )) as AreaCreateResult;

      expect(mockPrismaService.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO areas'),
        mockAreaRequestDto.name,
        JSON.stringify(mockAreaRequestDto.polygon),
        true,
        mockAreaRequestDto.producerId,
        mockAreaRequestDto.soilTypeId,
        mockAreaRequestDto.irrigationTypeId,
      );
      expect(result).toEqual({
        ...mockAreaResult,
        polygon: mockAreaRequestDto.polygon,
      });
    });

    it('should handle result as single object instead of array', async () => {
      mockPrismaService.$queryRawUnsafe.mockResolvedValue(mockAreaResult);

      const result = (await repository.create(
        mockAreaRequestDto,
      )) as AreaCreateResult;

      expect(mockPrismaService.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO areas'),
        mockAreaRequestDto.name,
        JSON.stringify(mockAreaRequestDto.polygon),
        true,
        mockAreaRequestDto.producerId,
        mockAreaRequestDto.soilTypeId,
        mockAreaRequestDto.irrigationTypeId,
      );
      expect(result).toEqual({
        ...mockAreaResult,
        polygon: mockAreaRequestDto.polygon,
      });
    });

    it('should handle undefined polygon in result', async () => {
      const resultWithoutPolygon = { ...mockAreaResult, polygon: undefined };
      mockPrismaService.$queryRawUnsafe.mockResolvedValue([
        resultWithoutPolygon,
      ]);

      const result = (await repository.create(
        mockAreaRequestDto,
      )) as AreaCreateResult;

      expect(result).toEqual({
        ...resultWithoutPolygon,
        polygon: undefined,
      });
    });

    it('should handle null polygon in result', async () => {
      const resultWithNullPolygon = { ...mockAreaResult, polygon: null };
      mockPrismaService.$queryRawUnsafe.mockResolvedValue([
        resultWithNullPolygon,
      ]);

      const result = (await repository.create(
        mockAreaRequestDto,
      )) as AreaCreateResult;

      expect(result).toEqual({
        ...resultWithNullPolygon,
        polygon: undefined,
      });
    });

    it('should use correct SQL query with all required parameters', async () => {
      mockPrismaService.$queryRawUnsafe.mockResolvedValue([mockAreaResult]);

      await repository.create(mockAreaRequestDto);

      const mockCalls = mockPrismaService.$queryRawUnsafe.mock.calls;
      const [query, ...params] = mockCalls[0] as [string, ...any[]];

      expect(query).toContain('INSERT INTO areas');
      expect(query).toContain(
        '(name, polygon, "isActive", "producerId", "soilTypeId", "irrigationTypeId", "createdAt", "updatedAt")',
      );
      expect(query).toContain('VALUES');
      expect(query).toContain(
        '($1, ST_GeomFromGeoJSON($2), $3, $4, $5, $6, NOW(), NOW())',
      );
      expect(query).toContain(
        'RETURNING id, name, "isActive", "producerId", "soilTypeId", "irrigationTypeId", "createdAt", ST_AsGeoJSON(polygon) AS polygon',
      );

      expect(params).toEqual([
        mockAreaRequestDto.name,
        JSON.stringify(mockAreaRequestDto.polygon),
        true,
        mockAreaRequestDto.producerId,
        mockAreaRequestDto.soilTypeId,
        mockAreaRequestDto.irrigationTypeId,
      ]);
    });
  });

  describe('findById', () => {
    it('should find area by id successfully', async () => {
      const areaId = 1;
      const mockRawResult = [
        {
          id: 1,
          name: 'Área Teste',
          isActive: true,
          producerId: 1,
          soilTypeId: 1,
          irrigationTypeId: 1,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
          polygon:
            '{"type":"Polygon","coordinates":[[[-46.6,-23.5],[-46.6,-23.4],[-46.5,-23.4],[-46.5,-23.5],[-46.6,-23.5]]]}',
          soilTypeName: 'Solo Argiloso',
          irrigationTypeName: 'Gotejamento',
        },
      ];

      mockPrismaService.$queryRawUnsafe.mockResolvedValue(mockRawResult);

      const result = await repository.findById(areaId);

      expect(mockPrismaService.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        areaId,
      );
      expect(result).toEqual({
        id: 1,
        name: 'Área Teste',
        isActive: true,
        producerId: 1,
        soilTypeId: 1,
        irrigationTypeId: 1,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
        polygon: {
          type: 'Polygon',
          coordinates: [
            [
              [-46.6, -23.5],
              [-46.6, -23.4],
              [-46.5, -23.4],
              [-46.5, -23.5],
              [-46.6, -23.5],
            ],
          ],
        },
        soilType: { id: 1, name: 'Solo Argiloso' },
        irrigationType: { id: 1, name: 'Gotejamento' },
      });
    });

    it('should return null when area is not found', async () => {
      const areaId = 999;
      mockPrismaService.$queryRawUnsafe.mockResolvedValue([]);

      const result = await repository.findById(areaId);

      expect(mockPrismaService.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        areaId,
      );
      expect(result).toBeNull();
    });
  });

  describe('findByProducerId', () => {
    it('should find areas by producer id successfully', async () => {
      const producerId = 1;
      const mockRawResult = [
        {
          id: 1,
          name: 'Área Teste 1',
          isActive: true,
          producerId: 1,
          soilTypeId: 1,
          irrigationTypeId: 1,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
          polygon:
            '{"type":"Polygon","coordinates":[[[-46.6,-23.5],[-46.6,-23.4],[-46.5,-23.4],[-46.5,-23.5],[-46.6,-23.5]]]}',
          soilTypeName: 'Solo Argiloso',
          irrigationTypeName: 'Gotejamento',
        },
        {
          id: 2,
          name: 'Área Teste 2',
          isActive: false,
          producerId: 1,
          soilTypeId: 2,
          irrigationTypeId: 2,
          createdAt: new Date('2023-01-02'),
          updatedAt: new Date('2023-01-02'),
          polygon:
            '{"type":"Polygon","coordinates":[[[-46.7,-23.6],[-46.7,-23.5],[-46.6,-23.5],[-46.6,-23.6],[-46.7,-23.6]]]}',
          soilTypeName: 'Solo Arenoso',
          irrigationTypeName: 'Aspersão',
        },
      ];

      mockPrismaService.$queryRawUnsafe.mockResolvedValue(mockRawResult);

      const result = await repository.findByProducerId(producerId);

      expect(mockPrismaService.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('WHERE a."producerId" = $1'),
        producerId,
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        name: 'Área Teste 1',
        isActive: true,
        producerId: 1,
        soilTypeId: 1,
        irrigationTypeId: 1,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
        polygon: {
          type: 'Polygon',
          coordinates: [
            [
              [-46.6, -23.5],
              [-46.6, -23.4],
              [-46.5, -23.4],
              [-46.5, -23.5],
              [-46.6, -23.5],
            ],
          ],
        },
        soilType: { id: 1, name: 'Solo Argiloso' },
        irrigationType: { id: 1, name: 'Gotejamento' },
      });
    });

    it('should return empty array when no areas are found for producer', async () => {
      const producerId = 999;
      mockPrismaService.$queryRawUnsafe.mockResolvedValue([]);

      const result = await repository.findByProducerId(producerId);

      expect(mockPrismaService.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('WHERE a."producerId" = $1'),
        producerId,
      );
      expect(result).toEqual([]);
    });
  });

  describe('updateStatus', () => {
    it('should update area status successfully', async () => {
      const areaId = 1;
      const isActive = true;
      mockPrismaService.area.update.mockResolvedValue(mockAreaFromDatabase);

      const result = (await repository.updateStatus(
        areaId,
        isActive,
      )) as MockAreaFromDatabase;

      expect(mockPrismaService.area.update).toHaveBeenCalledWith({
        where: { id: areaId },
        data: {
          isActive: isActive,
          updatedAt: expect.any(Date) as unknown as Date,
        },
      });
      expect(result).toEqual(mockAreaFromDatabase);
    });

    it('should handle Prisma errors when updating status', async () => {
      const areaId = 1;
      const isActive = false;
      const error = new Error('Database error');
      mockPrismaService.area.update.mockRejectedValue(error);

      await expect(repository.updateStatus(areaId, isActive)).rejects.toThrow(
        'Database error',
      );

      expect(mockPrismaService.area.update).toHaveBeenCalledWith({
        where: { id: areaId },
        data: {
          isActive: isActive,
          updatedAt: expect.any(Date) as unknown as Date,
        },
      });
    });

    it('should update the area status with proper timestamp', async () => {
      const areaId = 1;
      const isActive = true;
      mockPrismaService.area.update.mockResolvedValue(mockAreaFromDatabase);

      const beforeCall = new Date();
      await repository.updateStatus(areaId, isActive);
      const afterCall = new Date();

      const mockCalls = mockPrismaService.area.update.mock.calls;
      const updateCall = mockCalls[0]?.[0] as { data: { updatedAt: Date } };
      const updatedAt = updateCall?.data?.updatedAt;

      expect(updatedAt).toBeInstanceOf(Date);
      expect(updatedAt.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime());
      expect(updatedAt.getTime()).toBeLessThanOrEqual(afterCall.getTime());
    });
  });

  describe('update', () => {
    it('should update area successfully with all fields', async () => {
      const areaId = 1;
      const updateDto: UpdateAreaDto = {
        name: 'Área Atualizada',
        soilTypeId: 2,
        irrigationTypeId: 3,
        isActive: false,
      };
      const updatedArea = {
        ...mockAreaFromDatabase,
        name: 'Área Atualizada',
        soilTypeId: 2,
        irrigationTypeId: 3,
        isActive: false,
        updatedAt: new Date('2023-01-02'),
      };

      mockPrismaService.area.update.mockResolvedValue(updatedArea);

      const result = await repository.update(areaId, updateDto);

      expect(mockPrismaService.area.update).toHaveBeenCalledWith({
        where: { id: areaId },
        data: {
          name: updateDto.name,
          soilTypeId: updateDto.soilTypeId,
          irrigationTypeId: updateDto.irrigationTypeId,
          isActive: updateDto.isActive,
          updatedAt: expect.any(Date),
        },
      });
      expect(result).toEqual(updatedArea);
    });

    it('should update area with only name field', async () => {
      const areaId = 1;
      const updateDto: UpdateAreaDto = {
        name: 'Apenas Nome Atualizado',
      };
      const updatedArea = {
        ...mockAreaFromDatabase,
        name: 'Apenas Nome Atualizado',
        updatedAt: new Date('2023-01-02'),
      };

      mockPrismaService.area.update.mockResolvedValue(updatedArea);

      const result = await repository.update(areaId, updateDto);

      expect(mockPrismaService.area.update).toHaveBeenCalledWith({
        where: { id: areaId },
        data: {
          name: updateDto.name,
          updatedAt: expect.any(Date),
        },
      });
      expect(result).toEqual(updatedArea);
    });

    it('should update area with only isActive field', async () => {
      const areaId = 1;
      const updateDto: UpdateAreaDto = {
        isActive: false,
      };
      const updatedArea = {
        ...mockAreaFromDatabase,
        isActive: false,
        updatedAt: new Date('2023-01-02'),
      };

      mockPrismaService.area.update.mockResolvedValue(updatedArea);

      const result = await repository.update(areaId, updateDto);

      expect(mockPrismaService.area.update).toHaveBeenCalledWith({
        where: { id: areaId },
        data: {
          isActive: updateDto.isActive,
          updatedAt: expect.any(Date),
        },
      });
      expect(result).toEqual(updatedArea);
    });

    it('should update area with only soilTypeId and irrigationTypeId', async () => {
      const areaId = 1;
      const updateDto: UpdateAreaDto = {
        soilTypeId: 5,
        irrigationTypeId: 6,
      };
      const updatedArea = {
        ...mockAreaFromDatabase,
        soilTypeId: 5,
        irrigationTypeId: 6,
        updatedAt: new Date('2023-01-02'),
      };

      mockPrismaService.area.update.mockResolvedValue(updatedArea);

      const result = await repository.update(areaId, updateDto);

      expect(mockPrismaService.area.update).toHaveBeenCalledWith({
        where: { id: areaId },
        data: {
          soilTypeId: updateDto.soilTypeId,
          irrigationTypeId: updateDto.irrigationTypeId,
          updatedAt: expect.any(Date),
        },
      });
      expect(result).toEqual(updatedArea);
    });

    it('should not include undefined fields in update data', async () => {
      const areaId = 1;
      const updateDto: UpdateAreaDto = {
        name: 'Novo Nome',
        // soilTypeId, irrigationTypeId e isActive ficam undefined
      };
      const updatedArea = {
        ...mockAreaFromDatabase,
        name: 'Novo Nome',
        updatedAt: new Date('2023-01-02'),
      };

      mockPrismaService.area.update.mockResolvedValue(updatedArea);

      const result = await repository.update(areaId, updateDto);

      const expectedData = {
        name: updateDto.name,
        updatedAt: expect.any(Date),
      };

      expect(mockPrismaService.area.update).toHaveBeenCalledWith({
        where: { id: areaId },
        data: expectedData,
      });
      expect(result).toEqual(updatedArea);
      
      // Verifica que campos undefined não foram incluídos
      const actualCall = mockPrismaService.area.update.mock.calls[0][0];
      expect(actualCall.data).not.toHaveProperty('soilTypeId');
      expect(actualCall.data).not.toHaveProperty('irrigationTypeId');
      expect(actualCall.data).not.toHaveProperty('isActive');
    });

    it('should include fields with value 0 or false', async () => {
      const areaId = 1;
      const updateDto: UpdateAreaDto = {
        soilTypeId: 0,
        isActive: false,
      };
      const updatedArea = {
        ...mockAreaFromDatabase,
        soilTypeId: 0,
        isActive: false,
        updatedAt: new Date('2023-01-02'),
      };

      mockPrismaService.area.update.mockResolvedValue(updatedArea);

      const result = await repository.update(areaId, updateDto);

      expect(mockPrismaService.area.update).toHaveBeenCalledWith({
        where: { id: areaId },
        data: {
          soilTypeId: 0,
          isActive: false,
          updatedAt: expect.any(Date),
        },
      });
      expect(result).toEqual(updatedArea);
    });

    it('should update the area with proper timestamp', async () => {
      const areaId = 1;
      const updateDto: UpdateAreaDto = {
        name: 'Test',
      };
      mockPrismaService.area.update.mockResolvedValue(mockAreaFromDatabase);

      const beforeCall = new Date();
      await repository.update(areaId, updateDto);
      const afterCall = new Date();

      const mockCalls = mockPrismaService.area.update.mock.calls;
      const updateCall = mockCalls[0]?.[0] as { data: { updatedAt: Date } };
      const updatedAt = updateCall?.data?.updatedAt;

      expect(updatedAt).toBeInstanceOf(Date);
      expect(updatedAt.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime());
      expect(updatedAt.getTime()).toBeLessThanOrEqual(afterCall.getTime());
    });

    it('should handle Prisma errors when updating', async () => {
      const areaId = 1;
      const updateDto: UpdateAreaDto = {
        name: 'Test Error',
      };
      const error = new Error('Database connection failed');
      mockPrismaService.area.update.mockRejectedValue(error);

      await expect(repository.update(areaId, updateDto)).rejects.toThrow(
        'Database connection failed',
      );

      expect(mockPrismaService.area.update).toHaveBeenCalledWith({
        where: { id: areaId },
        data: {
          name: updateDto.name,
          updatedAt: expect.any(Date),
        },
      });
    });
  });
});
