import { Test, TestingModule } from '@nestjs/testing';
import { AreasRepository } from './areas.repository';
import { PrismaService } from '../shared/prisma/prisma.service';
import { AreaRequestDto } from './dto/area-request.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

describe('AreasRepository', () => {
  let repository: AreasRepository;

  const mockPrismaService = {
    $queryRawUnsafe: jest.fn(),
    area: { update: jest.fn() },
  };

  const mockAreaRequestDto: AreaRequestDto = {
    name: 'Área de Teste',
    producerId: 1,
    soilTypeId: 1,
    irrigationTypeId: 1,
    polygon: { type: 'Polygon', coordinates: [[[-51, -14], [-51, -15], [-52, -15], [-52, -14], [-51, -14]]]},
  };
  
  // Objeto completo retornado pela query (com polygon como STRING)
  const mockRawQueryResult = {
    id: 1,
    name: 'Área Teste',
    isActive: true,
    producerId: 1,
    soilTypeId: 1,
    irrigationTypeId: 1,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    polygon: JSON.stringify(mockAreaRequestDto.polygon), // Deve ser string
    areaSize: 12345.67,
    soilTypeName: 'Solo Argiloso',
    irrigationTypeName: 'Gotejamento',
  };

  // Objeto final após o mapeamento (com polygon como OBJETO)
  const mockFinalMappedArea = {
      id: mockRawQueryResult.id,
      name: mockRawQueryResult.name,
      isActive: mockRawQueryResult.isActive,
      producerId: mockRawQueryResult.producerId,
      soilTypeId: mockRawQueryResult.soilTypeId,
      irrigationTypeId: mockRawQueryResult.irrigationTypeId,
      createdAt: mockRawQueryResult.createdAt,
      updatedAt: mockRawQueryResult.updatedAt,
      polygon: mockAreaRequestDto.polygon, // Aqui é objeto
      areaSize: mockRawQueryResult.areaSize,
      soilType: { id: mockRawQueryResult.soilTypeId, name: mockRawQueryResult.soilTypeName },
      irrigationType: { id: mockRawQueryResult.irrigationTypeId, name: mockRawQueryResult.irrigationTypeName },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AreasRepository,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();
    repository = module.get<AreasRepository>(AreasRepository);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new area successfully', async () => {
      mockPrismaService.$queryRawUnsafe.mockResolvedValue(mockRawQueryResult);
      const result = await repository.create(mockAreaRequestDto);
      expect(result).toEqual(mockFinalMappedArea);
    });
  });

  describe('findById', () => {
    it('should find area by id successfully', async () => {
      mockPrismaService.$queryRawUnsafe.mockResolvedValue([mockRawQueryResult]);
      const result = await repository.findById(1);
      expect(result).toEqual(mockFinalMappedArea);
    });

    it('should return null when area is not found', async () => {
      mockPrismaService.$queryRawUnsafe.mockResolvedValue([]);
      const result = await repository.findById(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update area and return the full updated area', async () => {
      const updateDto: UpdateAreaDto = { name: 'Nome Atualizado' };
      mockPrismaService.area.update.mockResolvedValue({}); // Ação de update
      mockPrismaService.$queryRawUnsafe.mockResolvedValue([mockRawQueryResult]); // Ação do findById subsequente
      
      const result = await repository.update(1, updateDto);

      expect(mockPrismaService.area.update).toHaveBeenCalled();
      expect(result).toEqual(mockFinalMappedArea);
    });
  });

  describe('updateStatus', () => {
    it('should update status and return the full updated area', async () => {
      const updatedRawResult = { ...mockRawQueryResult, isActive: false };
      const updatedMappedResult = { ...mockFinalMappedArea, isActive: false };

      mockPrismaService.area.update.mockResolvedValue({});
      mockPrismaService.$queryRawUnsafe.mockResolvedValue([updatedRawResult]);
      
      const result = await repository.updateStatus(1, false);
      expect(result).toEqual(updatedMappedResult);
    });
  });
});