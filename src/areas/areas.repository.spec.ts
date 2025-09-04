import { Test, TestingModule } from '@nestjs/testing';
import { AreasRepository } from './areas.repository';
import { PrismaService } from '../shared/prisma/prisma.service';
import { AreaRequestDto } from './dto/area-request.dto';

describe('AreasRepository', () => {
  let repository: AreasRepository;
  let prismaService: PrismaService;

  const mockPrismaService = {
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

  const mockAreaFromDatabase = {
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

  const mockAreaResult = {
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
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new area successfully', async () => {
      mockPrismaService.$queryRawUnsafe.mockResolvedValue([mockAreaResult]);

      const result = await repository.create(mockAreaRequestDto);

      expect(prismaService.$queryRawUnsafe).toHaveBeenCalledWith(
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

      const result = await repository.create(mockAreaRequestDto);

      expect(prismaService.$queryRawUnsafe).toHaveBeenCalledWith(
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
      mockPrismaService.$queryRawUnsafe.mockResolvedValue([resultWithoutPolygon]);

      const result = await repository.create(mockAreaRequestDto);

      expect(result).toEqual({
        ...resultWithoutPolygon,
        polygon: undefined,
      });
    });

    it('should handle null polygon in result', async () => {
      const resultWithNullPolygon = { ...mockAreaResult, polygon: null };
      mockPrismaService.$queryRawUnsafe.mockResolvedValue([resultWithNullPolygon]);

      const result = await repository.create(mockAreaRequestDto);

      expect(result).toEqual({
        ...resultWithNullPolygon,
        polygon: undefined,
      });
    });

    it('should use correct SQL query with all required parameters', async () => {
      mockPrismaService.$queryRawUnsafe.mockResolvedValue([mockAreaResult]);

      await repository.create(mockAreaRequestDto);

      const [query, ...params] = mockPrismaService.$queryRawUnsafe.mock.calls[0];
      
      expect(query).toContain('INSERT INTO areas');
      expect(query).toContain('(name, polygon, ativo, "producerId", "soilTypeId", "irrigationTypeId", "createdAt", "updatedAt")');
      expect(query).toContain('VALUES');
      expect(query).toContain('($1, ST_GeomFromGeoJSON($2), $3, $4, $5, $6, NOW(), NOW())');
      expect(query).toContain('RETURNING id, name, ativo, "producerId", "soilTypeId", "irrigationTypeId", "createdAt", ST_AsGeoJSON(polygon) AS polygon');
      
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
      mockPrismaService.area.findUnique.mockResolvedValue(mockAreaFromDatabase);

      const result = await repository.findById(areaId);

      expect(prismaService.area.findUnique).toHaveBeenCalledWith({
        where: { id: areaId },
      });
      expect(result).toEqual(mockAreaFromDatabase);
    });

    it('should return null when area is not found', async () => {
      const areaId = 999;
      mockPrismaService.area.findUnique.mockResolvedValue(null);

      const result = await repository.findById(areaId);

      expect(prismaService.area.findUnique).toHaveBeenCalledWith({
        where: { id: areaId },
      });
      expect(result).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('should update area status to inactive successfully', async () => {
      const areaId = 1;
      const ativo = false;
      const updatedArea = {
        ...mockAreaFromDatabase,
        ativo: false,
        updatedAt: new Date('2023-01-02'),
      };
      mockPrismaService.area.update.mockResolvedValue(updatedArea);

      const result = await repository.updateStatus(areaId, ativo);

      expect(prismaService.area.update).toHaveBeenCalledWith({
        where: { id: areaId },
        data: { ativo: ativo, updatedAt: expect.any(Date) },
      });
      expect(result).toEqual(updatedArea);
    });

    it('should update area status to active successfully', async () => {
      const areaId = 1;
      const ativo = true;
      const updatedArea = {
        ...mockAreaFromDatabase,
        ativo: true,
        updatedAt: new Date('2023-01-02'),
      };
      mockPrismaService.area.update.mockResolvedValue(updatedArea);

      const result = await repository.updateStatus(areaId, ativo);

      expect(prismaService.area.update).toHaveBeenCalledWith({
        where: { id: areaId },
        data: { ativo: ativo, updatedAt: expect.any(Date) },
      });
      expect(result).toEqual(updatedArea);
    });

    it('should call update with current timestamp', async () => {
      const areaId = 1;
      const ativo = false;
      const beforeCall = new Date();
      mockPrismaService.area.update.mockResolvedValue(mockAreaFromDatabase);

      await repository.updateStatus(areaId, ativo);
      const afterCall = new Date();

      const updateCall = mockPrismaService.area.update.mock.calls[0][0];
      const updatedAt = updateCall.data.updatedAt;
      
      expect(updatedAt).toBeInstanceOf(Date);
      expect(updatedAt.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime());
      expect(updatedAt.getTime()).toBeLessThanOrEqual(afterCall.getTime());
    });
  });
});
