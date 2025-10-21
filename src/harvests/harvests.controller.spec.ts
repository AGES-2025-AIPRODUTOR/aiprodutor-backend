import { Test, TestingModule } from '@nestjs/testing';
import { HarvestsController } from './harvests.controller';
import { HarvestsService } from './harvests.service';

describe('HarvestsController', () => {
  let controller: HarvestsController;
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getHarvestPanel: jest.fn(),
    findHistory: jest.fn(),
    findByProducerId: jest.fn(),
    findByProducer: jest.fn(),
    findInProgressByProducer: jest.fn(),
    findHistoryByProducer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HarvestsController],
      providers: [{ provide: HarvestsService, useValue: mockService }],
    }).compile();

    controller = module.get<HarvestsController>(HarvestsController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create', async () => {
    const dto = { name: 'Safra Teste' } as any;
    mockService.create.mockResolvedValue({ id: 1, name: 'Safra Teste' });

    const res = await controller.create(dto);
    expect(res.id).toBe(1);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('findAll', async () => {
    mockService.findAll.mockResolvedValue([{ id: 1 } as any]);
    const res = await controller.findAll();
    expect(res.length).toBe(1);
  });

  it('findOne', async () => {
    mockService.findOne.mockResolvedValue({ id: 1 } as any);
    const res = await controller.findOne(1);
    expect(res.id).toBe(1);
  });

  it('update', async () => {
    mockService.update.mockResolvedValue({ id: 1, name: 'Updated' } as any);
    const res = await controller.update(1, { name: 'Updated' } as any);
    expect(res.name).toBe('Updated');
  });

  it('remove', async () => {
    mockService.remove.mockResolvedValue({ id: 1 } as any);
    const res = await controller.remove(1);
    expect(res.id).toBe(1);
  });

  it('getHarvestPanel', async () => {
    mockService.getHarvestPanel.mockResolvedValue({ generalInfo: { areaCount: 1, linkedPlantings: [] } } as any);
    const res = await controller.getHarvestPanel(1);
    expect(res.generalInfo.areaCount).toBe(1);
  });

  it('findByProducer', async () => {
    mockService.findByProducerId.mockResolvedValue([{ id: 1 } as any]);
    const res = await controller.findByProducer(1);
    expect(res.length).toBe(1);
    expect(mockService.findByProducerId).toHaveBeenCalledWith(1);
  });

  it('findHistory', async () => {
    mockService.findHistoryByProducer.mockResolvedValue([] as any);
    const res = await controller.findHistory(1, {} as any);
    expect(Array.isArray(res)).toBe(true);
    expect(mockService.findHistoryByProducer).toHaveBeenCalledWith(1, {});
  });

  it('findInProgressByProducer', async () => {
    mockService.findInProgressByProducer.mockResolvedValue([] as any);
    const res = await controller.findInProgressByProducer(1);
    expect(Array.isArray(res)).toBe(true);
    expect(mockService.findInProgressByProducer).toHaveBeenCalledWith(1);
  });
});
