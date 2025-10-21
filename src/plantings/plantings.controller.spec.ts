jest.mock('../areas/areas.repository', () => ({ AreasRepository: jest.fn() }));

import { Test, TestingModule } from '@nestjs/testing';
import { PlantingsController } from './plantings.controller';
import { PlantingsService } from './plantings.service';

describe('PlantingsController', () => {
  let controller: PlantingsController;
  let service: PlantingsService;

  const mockPlanting = { id: 1, name: 'P1' };

  const mockService = {
    create: jest.fn(),
    findByProductId: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    findByProducerId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlantingsController],
      providers: [{ provide: PlantingsService, useValue: mockService }],
    }).compile();

    controller = module.get<PlantingsController>(PlantingsController);
    service = module.get<PlantingsService>(PlantingsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create', async () => {
    mockService.create.mockResolvedValue(mockPlanting);
    const dto = { name: 'P1' } as any;
    const res = await controller.create(dto);
    expect(res).toEqual(mockPlanting);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('findByProduct', async () => {
    mockService.findByProductId.mockResolvedValue([mockPlanting]);
    const res = await controller.findByProduct(1);
    expect(res).toEqual([mockPlanting]);
  });

  it('findOne', async () => {
    mockService.findOne.mockResolvedValue(mockPlanting);
    const res = await controller.findOne(1);
    expect(res).toEqual(mockPlanting);
  });

  it('update', async () => {
    mockService.update.mockResolvedValue({ ...mockPlanting, name: 'Updated' });
    const res = await controller.update(1, { name: 'Updated' } as any);
    expect(res.name).toBe('Updated');
  });

  it('findAll', async () => {
    mockService.findAll.mockResolvedValue([mockPlanting]);
    const res = await controller.findAll();
    expect(res).toEqual([mockPlanting]);
  });
});
