import { Test, TestingModule } from '@nestjs/testing';
import { ProducersController } from './producers.controller';
import { ProducersService } from './producers.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { ConflictException } from '@nestjs/common';
import { PlantingsService } from '../plantings/plantings.service';
import { HarvestsService } from '../harvests/harvests.service';

describe('ProducersController', () => {
  let controller: ProducersController;

  const mockProducer = {
    id: 1,
    name: 'João da Silva',
    document: '12345678901',
    email: 'joao@email.com',
    phone: '51999998888',
    zipCode: '90619900',
    city: 'Porto Alegre',
    street: 'Rua A',
    number: '100',
    complement: 'Apto 1',
  };

  const mockService = {
    create: jest.fn(),
    findAllOrByDocument: jest.fn(),
    findOne: jest.fn(),
  };

  const mockPlantingsService = {
    // Adicione aqui os métodos do PlantingsService que são usados no controller
  };

  const mockHarvestsService = {
    // Adicione aqui os métodos do HarvestsService que são usados no controller
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducersController],
      providers: [
        { provide: ProducersService, useValue: mockService },
        { provide: PlantingsService, useValue: mockPlantingsService },
        { provide: HarvestsService, useValue: mockHarvestsService },
      ],
    }).compile();

    controller = module.get<ProducersController>(ProducersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a producer', async () => {
    mockService.create.mockResolvedValue(mockProducer);
    const dto: CreateProducerDto = {
      name: 'João da Silva',
      document: '12345678901',
      email: 'joao@email.com',
      phone: '51999998888',
      zipCode: '90619900',
      city: 'Porto Alegre',
      street: 'Rua A',
      number: '100',
      complement: 'Apto 1',
    };
    const result = await controller.create(dto);
    expect(result).toEqual(mockProducer);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('should throw ConflictException when service throws', async () => {
    mockService.create.mockRejectedValue(new ConflictException());
    const dto: CreateProducerDto = {
      name: 'João da Silva',
      document: '12345678901',
      email: 'joao@email.com',
      phone: '51999998888',
      zipCode: '90619900',
      city: 'Porto Alegre',
      street: 'Rua A',
      number: '100',
      complement: 'Apto 1',
    };
    await expect(controller.create(dto)).rejects.toThrow(ConflictException);
  });

  it('should return all producers', async () => {
    mockService.findAllOrByDocument.mockResolvedValue([mockProducer]);
    const result = await controller.findAllOrByDocument();
    expect(result).toEqual([mockProducer]);
    expect(mockService.findAllOrByDocument).toHaveBeenCalled();
  });

  it('should return a producer by id', async () => {
    mockService.findOne.mockResolvedValue(mockProducer);
    const result = await controller.findOne(1);
    expect(result).toEqual(mockProducer);
    expect(mockService.findOne).toHaveBeenCalledWith(1);
  });

  it('should return a producer by document', async () => {
    mockService.findAllOrByDocument.mockResolvedValue(mockProducer);
    const dto = {
      document: '12345678901',
    };
    const result = await controller.findAllOrByDocument(dto);
    expect(result).toEqual(mockProducer);
    expect(mockService.findAllOrByDocument).toHaveBeenCalledWith(dto.document);
  });
});
