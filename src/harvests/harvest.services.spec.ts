import { Test, TestingModule } from '@nestjs/testing';
import { HarvestsService } from './harvests.service';
import { HarvestsRepository } from './harvests.repository';
import { NotFoundException } from '@nestjs/common';
import { HarvestResponseDto } from './dto/harvest-response.dto';

describe('HarvestsService - findInProgressByProducer', () => {
  let service: HarvestsService;
  let repository: jest.Mocked<HarvestsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestsService,
        {
          provide: HarvestsRepository,
          useValue: {
            findInProgressByProducer: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HarvestsService>(HarvestsService);
    repository = module.get(HarvestsRepository);
  });

  it('Deve retornar lista de safras em andamento (DTO)', async () => {
    repository.findInProgressByProducer.mockResolvedValue([
      { id: 1, name: 'Safra de Verão', startDate: new Date('2025-09-22'), endDate: null },
      { id: 2, name: 'Safra de Inverno', startDate: new Date('2025-03-01'), endDate: new Date('2025-07-01') },
    ] as any);

    const result = await service.findInProgressByProducer(10);

    const expected: HarvestResponseDto[] = [
      {
        harvestId: 1,
        harvestName: 'Safra de Verão',
        harvestInitialDate: new Date('2025-09-22'),
        harvestEndDate: null,
      },
      {
        harvestId: 2,
        harvestName: 'Safra de Inverno',
        harvestInitialDate: new Date('2025-03-01'),
        harvestEndDate: new Date('2025-07-01'),
      },
    ];

    expect(result).toEqual(expected);
    expect(repository.findInProgressByProducer).toHaveBeenCalledWith(10);
  });

  it('Deve lançar NotFoundException se não houver safras', async () => {
    repository.findInProgressByProducer.mockResolvedValue([]);

    await expect(service.findInProgressByProducer(10)).rejects.toThrow(NotFoundException);
  });
});
