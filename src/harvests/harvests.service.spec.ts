import { Test, TestingModule } from '@nestjs/testing';
import { HarvestsService } from './harvests.service';
import { HarvestsRepository } from './harvests.repository';
import { AreasService } from '../areas/areas.service';
import { ProducersService } from '../producers/producers.service';
import { ProductsService } from '../products/products.service';
import { VarietiesService } from '../varieties/varieties.service';
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
  const mockVarietiesService = { findOne: jest.fn() };

  const sampleHarvest: any = {
    id: 1,
    name: 'Safra Teste',
    producerId: 1,
    areas: [{ id: 1, name: 'Area 1' }],
    plantings: [
      { id: 10, name: 'Plantio A', productId: 1, varietyId: 1, product: { name: 'Produto A' }, areas: [{ id: 1, name: 'Area 1' }], quantityPlanted: 100 }
    ],
    startDate: new Date(),
    endDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestsService,
        { provide: HarvestsRepository, useValue: mockRepository },
        { provide: AreasService, useValue: mockAreasService },
        { provide: ProducersService, useValue: mockProducersService },
        { provide: ProductsService, useValue: mockProductsService },
        { provide: VarietiesService, useValue: mockVarietiesService },
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
      mockAreasService.findOne.mockResolvedValue({ id: 1 });
      mockProductsService.findOne.mockResolvedValue({ id: 1 });
      mockVarietiesService.findOne.mockResolvedValue({ id: 1 });
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
      mockRepository.getTotalAreaForHarvest.mockResolvedValue(10000);

      const panel = await service.getHarvestPanel(1);
      expect(panel.generalInfo.areaCount).toBeDefined();
      expect(panel.generalInfo.linkedPlantings.length).toBe(sampleHarvest.plantings.length);
    });
  });
});
