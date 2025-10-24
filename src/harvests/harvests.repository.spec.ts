import { Test, TestingModule } from '@nestjs/testing';
import { HarvestsRepository } from './harvests.repository';
import { PrismaService } from '../shared/prisma/prisma.service';

import { Decimal } from '@prisma/client/runtime/library';

const mockPrisma = () => ({
  harvest: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

describe('HarvestsRepository', () => {
  let repo: HarvestsRepository;
  let prisma: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestsRepository,
        { provide: PrismaService, useFactory: mockPrisma },
      ],
    }).compile();

    repo = module.get<HarvestsRepository>(HarvestsRepository);
    prisma = module.get(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  it('create', async () => {
    prisma.harvest.create.mockResolvedValue({ id: 1, name: 'Safra' });
    const res = await repo.create({ name: 'Safra', areaIds: [1], producerId: 1 } as any);
    expect(res.id).toBe(1);
    expect(prisma.harvest.create).toHaveBeenCalled();
  });

  it('findAll', async () => {
    prisma.harvest.findMany.mockResolvedValue([{ id: 1 }]);
    const res = await repo.findAll();
    expect(res.length).toBe(1);
  });

  it('findById', async () => {
    prisma.harvest.findUnique.mockResolvedValue({ id: 1 });
  const res = await repo.findById(1);
  expect(res).not.toBeNull();
  expect(res!.id).toBe(1);
  });

  it('update', async () => {
    prisma.harvest.update.mockResolvedValue({ id: 1, name: 'Updated' });
    const res = await repo.update(1, { name: 'Updated' } as any);
    expect(res.name).toBe('Updated');
  });

  it('remove', async () => {
    prisma.harvest.delete.mockResolvedValue({ id: 1 });
    const res = await repo.remove(1);
    expect(res.id).toBe(1);
  });

  it('getTotalAreaForHarvest uses $queryRaw', async () => {
    // mock a findUnique that returns plantings with areas including areaM2 (Decimal)
    // Provide a real Decimal instance for areaM2 so repository reduction works
    const decimalVal = new Decimal(12);
    prisma.harvest.findUnique.mockResolvedValue({
      id: 1,
      plantings: [
        { areas: [{ id: 1, areaM2: decimalVal }] },
      ],
    });
    const res = await repo.getTotalAreaForHarvest(1);
    expect(prisma.harvest.findUnique).toHaveBeenCalled();
    expect(res).toEqual(12);
  });

  it('getTotalAreaForHarvest returns 0 when harvest missing', async () => {
    prisma.harvest.findUnique.mockResolvedValue(null);
    const res = await repo.getTotalAreaForHarvest(999);
    expect(res).toBe(0);
  });

  it('getTotalAreaForHarvest returns 0 when harvest has no plantings', async () => {
    prisma.harvest.findUnique.mockResolvedValue({ id: 2, plantings: [] });
    const res = await repo.getTotalAreaForHarvest(2);
    expect(res).toBe(0);
  });

  it('getTotalAreaForHarvest deduplicates areas across plantings', async () => {
    const decimalVal = new Decimal(5);
    // area id 1 appears twice across plantings
    prisma.harvest.findUnique.mockResolvedValue({
      id: 3,
      plantings: [
        { areas: [{ id: 1, areaM2: decimalVal }, { id: 2, areaM2: new Decimal(3) }] },
        { areas: [{ id: 1, areaM2: decimalVal }] },
      ],
    });

    const res = await repo.getTotalAreaForHarvest(3);
    // unique areas: id1 (5) + id2 (3) = 8
    expect(res).toBe(8);
  });

  it('findHistoryByProducer applies filters and returns mapped result', async () => {
    const fakeDbResult = [
      {
        id: 10,
        name: 'Safra X',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        status: 'Completed',
        plantings: [
          { id: 1, plantingDate: new Date('2025-02-01'), expectedHarvestDate: new Date('2025-06-01'), quantityPlanted: 100, areas: [{ id: 1, name: 'A' }] },
        ],
      },
    ];

    prisma.harvest.findMany.mockResolvedValue(fakeDbResult);
    const res = await repo.findHistoryByProducer(1, { safraName: 'Safra', status: 'Completed' } as any);
  expect(Array.isArray(res)).toBe(true);
  expect(res[0].id).toBe(10);
  });
});
