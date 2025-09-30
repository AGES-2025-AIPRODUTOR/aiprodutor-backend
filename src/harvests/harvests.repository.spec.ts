import { Test, TestingModule } from '@nestjs/testing';
import { HarvestsRepository } from './harvests.repository';
import { PrismaService } from '../shared/prisma/prisma.service';

const mockPrisma = () => ({
  harvest: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $queryRaw: jest.fn(),
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
    prisma.$queryRaw.mockResolvedValue([{ total_area: 12 }]);
    const res = await repo.getTotalAreaForHarvest(1);
    expect(prisma.$queryRaw).toHaveBeenCalled();
    expect(res).toEqual(12);
  });
});
