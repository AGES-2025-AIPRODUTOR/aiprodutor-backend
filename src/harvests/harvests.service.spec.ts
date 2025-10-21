import { Test, TestingModule } from '@nestjs/testing';
import { HarvestsService } from './harvests.service';
import { Decimal } from '@prisma/client/runtime/library';
import { HarvestsRepository } from './harvests.repository';
import { AreasService } from '../areas/areas.service';
import { ProducersService } from '../producers/producers.service';
import { ProductsService } from '../products/products.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateHarvestDto } from './dto/create-harvest.dto';

describe('HarvestsService', () => {
  let service: HarvestsService;

  const mockRepository = {
    findByName: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByProducerId: jest.fn(),
    getTotalAreaForHarvest: jest.fn(),
    findHistoryByProducer: jest.fn(),
  };

  const mockAreasService = { findOne: jest.fn() };
  const mockProducersService = { findOne: jest.fn() };
  const mockProductsService = { findOne: jest.fn() };
  // VarietiesService removed from current implementation; keep only used mocks

  const sampleHarvest: any = {
    id: 1,
    name: 'Safra Teste',
    producerId: 1,
    expectedYield: 100,
    startDate: new Date(),
    endDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    plantings: [
      {
        id: 10,
        name: 'Plantio A',
        productId: 1,
        product: { name: 'Produto A' },
        expectedYield: 100,
        plantingDate: new Date(),
        expectedHarvestDate: new Date(),
        areas: [{ id: 1, name: 'Area 1', producerId: 1, areaM2: new Decimal(10000) }],
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestsService,
        { provide: HarvestsRepository, useValue: mockRepository },
        { provide: AreasService, useValue: mockAreasService },
        { provide: ProducersService, useValue: mockProducersService },
        { provide: ProductsService, useValue: mockProductsService },
  // VarietiesService not used in current HarvestsService constructor
      ],
    }).compile();

    service = module.get<HarvestsService>(HarvestsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates a harvest when producer and areas exist, and creates nested plantings', async () => {
      const dto: CreateHarvestDto = {
        name: 'Safra Teste',
        producerId: 1,
        areaIds: [1],
        startDate: new Date(),
        plantings: [
          {
            name: 'Plantio A',
            plantingDate: new Date(),
            quantityPlanted: 100,
            productId: 1,
            varietyId: 1,
            areaIds: [1],
          },
        ],
      } as any;

      mockRepository.findByName.mockResolvedValue(null);
      mockProducersService.findOne.mockResolvedValue({ id: 1 });
  mockAreasService.findOne.mockResolvedValue({ id: 1, producerId: 1, areaM2: new Decimal(10000) });
      mockProductsService.findOne.mockResolvedValue({ id: 1 });
      mockRepository.create.mockResolvedValue(sampleHarvest);

      const result = await service.create(dto);

      expect(mockRepository.findByName).toHaveBeenCalledWith('Safra Teste');
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(result.id).toBe(1);
    });

    it('throws ConflictException when harvest name already exists', async () => {
      const dto: CreateHarvestDto = { name: 'Safra Teste', producerId: 1, areaIds: [1], startDate: new Date() } as any;
      mockRepository.findByName.mockResolvedValue(sampleHarvest);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('throws BadRequestException when a planting area does not belong to the producer', async () => {
      const dto: CreateHarvestDto = {
        name: 'Safra Teste',
        producerId: 1,
        areaIds: [1],
        startDate: new Date(),
        plantings: [
          {
            name: 'Plantio X',
            plantingDate: new Date(),
            quantityPlanted: 10,
            productId: 1,
            areaIds: [2],
          },
        ],
      } as any;

      mockRepository.findByName.mockResolvedValue(null);
      mockProducersService.findOne.mockResolvedValue({ id: 1 });
      // area 2 belongs to a different producer
      mockAreasService.findOne.mockResolvedValue({ id: 2, producerId: 999 });
      mockProductsService.findOne.mockResolvedValue({ id: 1 });

  await expect(service.create(dto)).rejects.toThrow(/não pertence ao produtor/);
    });
  });

  describe('findOne', () => {
    it('returns harvest when found', async () => {
      mockRepository.findById.mockResolvedValue(sampleHarvest);
      const res = await service.findOne(1);
      expect(res.id).toBe(1);
    });

    it('throws NotFoundException when missing', async () => {
      mockRepository.findById.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update and remove', () => {
    it('updates existing harvest', async () => {
      mockRepository.findById.mockResolvedValue(sampleHarvest);
      mockRepository.update.mockResolvedValue({ ...sampleHarvest, name: 'Updated' });

      const res = await service.update(1, { name: 'Updated' } as any);
      expect(res.name).toBe('Updated');
    });

    it('removes existing harvest when no plantings', async () => {
      mockRepository.findById.mockResolvedValue({ ...sampleHarvest, plantings: [] });
      mockRepository.remove.mockResolvedValue({ ...sampleHarvest, plantings: [] });

      const res = await service.remove(1);
      expect(res.id).toBe(1);
      expect(mockRepository.remove).toHaveBeenCalledWith(1);
    });

    it('throws when removing harvest with plantings', async () => {
      mockRepository.findById.mockResolvedValue(sampleHarvest);
      await expect(service.remove(1)).rejects.toThrow();
    });
  });

  describe('findByProducerId and getHarvestPanel', () => {
    it('findByProducerId delegates to repository', async () => {
      mockProducersService.findOne.mockResolvedValue({ id: 1 });
      mockRepository.findByProducerId.mockResolvedValue([sampleHarvest]);

      const res = await service.findByProducerId(1);
      expect(res.length).toBe(1);
    });

    it('getHarvestPanel returns transformed panel', async () => {
      mockRepository.findById.mockResolvedValue(sampleHarvest);

      const panel = await service.getHarvestPanel(1);
      expect(panel.generalInfo.areaCount).toBeDefined();
      expect(panel.generalInfo.linkedPlantings.length).toBe(sampleHarvest.plantings.length);
      expect(panel.generalInfo.totalArea).toBeGreaterThan(0);
    });
  });
});
