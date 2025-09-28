import { Test, TestingModule } from '@nestjs/testing';
import { HarvestsController } from './harvests.controller';
import { HarvestsService } from './harvests.service';
import { HarvestResponseDto } from './dto/harvest-response.dto';
import { NotFoundException } from '@nestjs/common';

describe('HarvestsController - findInProgressByProducer', () => {
  let controller: HarvestsController;
  let service: jest.Mocked<HarvestsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HarvestsController],
      providers: [
        {
          provide: HarvestsService,
          useValue: {
            findInProgressByProducer: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HarvestsController>(HarvestsController);
    service = module.get(HarvestsService);
  });

  it('Deve retornar a lista de safras em andamento', async () => {
    const mockResponse: HarvestResponseDto[] = [
      {
        harvestId: 1,
        harvestName: 'Safra de Verão',
        harvestInitialDate: new Date('2025-09-22'),
        harvestEndDate: null,
      },
    ];

    service.findInProgressByProducer.mockResolvedValue(mockResponse);

    const result = await controller.findInProgressByProducer(10);

    expect(result).toEqual(mockResponse);
    expect(service.findInProgressByProducer).toHaveBeenCalledWith(10);
  });

  it('Deve propagar NotFoundException do service', async () => {
    service.findInProgressByProducer.mockRejectedValue(
      new NotFoundException('Não há nenhuma safra em andamento.'),
    );

    await expect(controller.findInProgressByProducer(10)).rejects.toThrow(
      NotFoundException,
    );
  });
});
