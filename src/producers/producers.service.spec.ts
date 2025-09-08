import { Test, TestingModule } from '@nestjs/testing';
import { ProducersService } from './producers.service';
import { ProducersRepository } from './producers.repository';
import { ConflictException } from '@nestjs/common';
import { CreateProducerDto } from './dto/create-producer.dto';

describe('ProducersService', () => {
  let service: ProducersService;
  let repository: ProducersRepository;

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

  const mockRepository = {
    findByDocument: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        { provide: ProducersRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ProducersService>(ProducersService);
    repository = module.get<ProducersRepository>(ProducersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a producer if document and email are unique', async () => {
    mockRepository.findByDocument.mockResolvedValue(null);
    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue(mockProducer);

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

    const result = await service.create(dto);
    expect(result).toEqual(mockProducer);
    expect(mockRepository.findByDocument).toHaveBeenCalledWith(dto.document);
    expect(mockRepository.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(mockRepository.create).toHaveBeenCalledWith(dto);
  });

  it('should throw ConflictException if document already exists', async () => {
    mockRepository.findByDocument.mockResolvedValue(mockProducer);
    mockRepository.findByEmail.mockResolvedValue(null);

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

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
    expect(mockRepository.findByDocument).toHaveBeenCalledWith(dto.document);
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('should throw ConflictException if email already exists', async () => {
    mockRepository.findByDocument.mockResolvedValue(null);
    mockRepository.findByEmail.mockResolvedValue(mockProducer);

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

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
    expect(mockRepository.findByDocument).toHaveBeenCalledWith(dto.document);
    expect(mockRepository.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('should return all producers', async () => {
    mockRepository.findAll.mockResolvedValue([mockProducer]);
    const result = await service.findAll();
    expect(result).toEqual([mockProducer]);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  it('should return a producer by id', async () => {
    mockRepository.findById.mockResolvedValue(mockProducer);
    const result = await service.findOne(1); // pass number instead of string
    expect(result).toEqual(mockProducer);
    expect(mockRepository.findById).toHaveBeenCalledWith(1);
  });

  it('should return a producer by document (CPF/CNPJ)', async () => {
    mockRepository.findByDocument.mockResolvedValue(mockProducer);

    const document = '12345678901';
    const result = await service.findDocument(document);

    expect(result).toEqual(mockProducer);
    expect(mockRepository.findByDocument).toHaveBeenCalledWith(document);
  });
});
