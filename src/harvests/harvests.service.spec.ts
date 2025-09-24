import { Test, TestingModule } from '@nestjs/testing';
import { HarvestsService } from './harvests.service';
import { HarvestsRepository } from './harvests.repository';

describe('HarvestsService', () => {
  let service: HarvestsService;

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findHarvestWithRelations: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestsService,
        { provide: HarvestsRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<HarvestsService>(HarvestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});