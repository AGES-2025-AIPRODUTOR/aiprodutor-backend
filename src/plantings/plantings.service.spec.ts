jest.mock('../areas/areas.repository', () => ({ AreasRepository: jest.fn() }));

import { Test, TestingModule } from '@nestjs/testing';
import { PlantingsService } from './plantings.service';
import { PlantingsRepository } from './plantings.repository';
import { ProductsService } from '../products/products.service';
import { AreasService } from '../areas/areas.service';
import { HarvestsService } from '../harvests/harvests.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PlantingsService', () => {
  let service: PlantingsService;

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    existsByVarietyId: jest.fn(),
    findByProductId: jest.fn(),
    findByProducerId: jest.fn(),
  };

  const mockProductsService = { findOne: jest.fn() };
  const mockAreasService = { findOne: jest.fn() };
  const mockHarvestsService = { findOne: jest.fn() };

  const samplePlanting = {
    id: 1,
    harvestId: 1,
    areaId: 2,
    name: 'Plantio X',
    productId: 1,
    varietyId: 1,
    plantingDate: new Date(),
    plantingEndDate: new Date(),
    expectedHarvestDate: new Date(),
    quantityPlanted: 100,
    quantityHarvested: 50,
    areas: [{ id: 2, name: 'Area 2', color: '#fff' }],
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlantingsService,
        { provide: PlantingsRepository, useValue: mockRepository },
  { provide: ProductsService, useValue: mockProductsService },
        { provide: AreasService, useValue: mockAreasService },
        { provide: HarvestsService, useValue: mockHarvestsService },
      ],
    }).compile();

    service = module.get<PlantingsService>(PlantingsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates when related resources exist and area belongs to harvest', async () => {
  const dto = { productId: 1, areaIds: [2], harvestId: 1 } as any;
        mockProductsService.findOne.mockResolvedValue({ id: 1, producerId: 1 });
  mockAreasService.findOne.mockResolvedValue({ id: 2, producerId: 1 });
  mockHarvestsService.findOne.mockResolvedValue({ id: 1, producerId: 1, areas: [{ id: 2 }] });
      mockRepository.create.mockResolvedValue(samplePlanting);

      const result = await service.create(dto);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(result.id).toBe(1);
    });

    it('throws BadRequest if area not in harvest', async () => {
  const dto = { productId: 1, areaIds: [3], harvestId: 1 } as any;
        mockProductsService.findOne.mockResolvedValue({ id: 1, producerId: 1 });
  mockAreasService.findOne.mockResolvedValue({ id: 3, producerId: 999 });
  mockHarvestsService.findOne.mockResolvedValue({ id: 1, producerId: 1, areas: [{ id: 2 }] });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('returns planting when found', async () => {
      mockRepository.findById.mockResolvedValue(samplePlanting);
      const result = await service.findOne(1);
      expect(result.id).toBe(1);
    });

    it('throws NotFoundException when missing', async () => {
      mockRepository.findById.mockResolvedValue(null);
      await expect(service.findOne(2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates an existing planting', async () => {
      mockRepository.findById.mockResolvedValue(samplePlanting);
      mockHarvestsService.findOne.mockResolvedValue({ id: 1 });
      mockRepository.update.mockResolvedValue({ ...samplePlanting, name: 'Updated' });

      const result = await service.update(1, { name: 'Updated' } as any);
      expect(result.name).toBe('Updated');
    });
  });

  describe('findByProductId and findAll', () => {
    it('findByProductId calls productsService and repository', async () => {
      mockProductsService.findOne.mockResolvedValue({ id: 1 });
      mockRepository.findByProductId.mockResolvedValue([samplePlanting]);

      const result = await service.findByProductId(1);
      expect(mockProductsService.findOne).toHaveBeenCalledWith(1);
      expect(result.length).toBe(1);
    });

    it('findAll returns list', async () => {
      mockRepository.findAll.mockResolvedValue([samplePlanting]);
      const result = await service.findAll();
      expect(result.length).toBe(1);
    });
  });

  describe('findByProducerId', () => {
    it('returns plantings by producer id', async () => {
      mockRepository.findByProducerId.mockResolvedValue([samplePlanting]);
      const result = await service.findByProducerId(5);
      expect(result.length).toBe(1);
    });
  });

  describe('remove', () => {
    it('removes existing planting', async () => {
      mockRepository.findById.mockResolvedValue(samplePlanting);
      mockRepository.remove.mockResolvedValue({});

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(mockRepository.remove).toHaveBeenCalledWith(1);
    });

    it('throws NotFoundException when removing non-existing planting', async () => {
      mockRepository.findById.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });
});
