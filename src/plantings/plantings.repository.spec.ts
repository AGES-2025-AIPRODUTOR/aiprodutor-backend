import { Test, TestingModule } from '@nestjs/testing';
import { PlantingsRepository } from './plantings.repository';
import { PrismaService } from '../shared/prisma/prisma.service';

describe('PlantingsRepository', () => {
  let repo: PlantingsRepository;

  const prismaMock = {
    planting: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
    },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlantingsRepository,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    repo = module.get<PlantingsRepository>(PlantingsRepository);
  });

  afterEach(() => jest.clearAllMocks());

  it('create', async () => {
    const dto = { name: 'P', areaIds: [1] } as any;
    prismaMock.planting.create.mockResolvedValue({ id: 1, ...dto });
    const r = await repo.create(dto);
    expect(prismaMock.planting.create).toHaveBeenCalled();
    expect(r).toBeDefined();
    expect(r!.id).toBe(1);
  });

  it('findAll includes areas', async () => {
    prismaMock.planting.findMany.mockResolvedValue([{ id: 1, areas: [] }]);
    const r = await repo.findAll();
    expect(prismaMock.planting.findMany).toHaveBeenCalledWith({ include: { areas: true } });
    expect(r.length).toBe(1);
  });

  it('findById includes areas', async () => {
    prismaMock.planting.findUnique.mockResolvedValue({ id: 1, areas: [] });
  const r = await repo.findById(1);
  expect(prismaMock.planting.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, include: { areas: true } });
  expect(r).toBeDefined();
  expect(r!.id).toBe(1);
  });

  it('update', async () => {
    prismaMock.planting.update.mockResolvedValue({ id: 1, name: 'U' });
  const r = await repo.update(1, { name: 'U' } as any);
  expect(prismaMock.planting.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { name: 'U' }, include: { areas: true } });
  expect(r).toBeDefined();
  expect(r!.name).toBe('U');
  });

  it('remove', async () => {
    prismaMock.planting.delete.mockResolvedValue({ id: 1 });
    const r = await repo.remove(1);
    expect(prismaMock.planting.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  // existsByVarietyId was removed from repository implementation — no test needed

  it('findByProductId', async () => {
    prismaMock.planting.findMany.mockResolvedValue([{ id: 1, areas: [] }]);
    const r = await repo.findByProductId(1);
    expect(prismaMock.planting.findMany).toHaveBeenCalledWith({ where: { productId: 1 }, include: { areas: true } });
    expect(r.length).toBe(1);
  });

  it('findByProducerId', async () => {
    prismaMock.planting.findMany.mockResolvedValue([{ id: 1, areas: [], harvest: {} }]);
    const r = await repo.findByProducerId(1);
    expect(prismaMock.planting.findMany).toHaveBeenCalled();
    expect(r.length).toBe(1);
  });
});
