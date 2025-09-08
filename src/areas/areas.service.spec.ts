import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreasRepository } from './areas.repository';
import { ProducersRepository } from '../producers/producers.repository';
import { SoilTypesRepository } from '../soil-types/soil-types.repository';
import { IrrigationTypesRepository } from '../irrigation-types/irrigation-types.repository';
import { AreaRequestDto } from './dto/area-request.dto';
import { UpdateAreaStatusDto } from './dto/update-area-status.dto';

describe('AreasService', () => {
  let service: AreasService;
  let areasRepository: AreasRepository;
  let producersRepository: ProducersRepository;
  let soilTypesRepository: SoilTypesRepository;
  let irrigationTypesRepository: IrrigationTypesRepository;

  const mockAreasRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    updateStatus: jest.fn(),
  };

  const mockProducersRepository = {
    findById: jest.fn(),
  };

  const mockSoilTypesRepository = {
    findById: jest.fn(),
  };

  const mockIrrigationTypesRepository = {
    findById: jest.fn(),
  };

  const mockAreaRequestDto: AreaRequestDto = {
    name: 'Área de Teste',
    producerId: 1,
    soilTypeId: 1,
    irrigationTypeId: 1,
    polygon: {
      type: 'Polygon',
      coordinates: [
        [
          [-51.92528, -14.235004],
          [-51.92528, -14.235005],
          [-51.92529, -14.235005],
          [-51.92529, -14.235004],
          [-51.92528, -14.235004],
        ],
      ],
    },
  };

  const mockProducer = {
    id: 1,
    name: 'Produtor Teste',
    document: '12345678901',
    email: 'produtor@teste.com',
  };

  const mockSoilType = {
    id: 1,
    name: 'Tipo de Solo Teste',
  };

  const mockIrrigationType = {
    id: 1,
    name: 'Tipo de Irrigação Teste',
  };

  const mockArea = {
    id: 1,
    name: 'Área de Teste',
    producerId: 1,
    soilTypeId: 1,
    irrigationTypeId: 1,
    ativo: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    polygon: mockAreaRequestDto.polygon,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AreasService,
        {
          provide: AreasRepository,
          useValue: mockAreasRepository,
        },
        {
          provide: ProducersRepository,
          useValue: mockProducersRepository,
        },
        {
          provide: SoilTypesRepository,
          useValue: mockSoilTypesRepository,
        },
        {
          provide: IrrigationTypesRepository,
          useValue: mockIrrigationTypesRepository,
        },
      ],
    }).compile();

    service = module.get<AreasService>(AreasService);
    areasRepository = module.get<AreasRepository>(AreasRepository);
    producersRepository = module.get<ProducersRepository>(ProducersRepository);
    soilTypesRepository = module.get<SoilTypesRepository>(SoilTypesRepository);
    irrigationTypesRepository = module.get<IrrigationTypesRepository>(
      IrrigationTypesRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new area successfully when all dependencies exist', async () => {
      mockProducersRepository.findById.mockResolvedValue(mockProducer);
      mockSoilTypesRepository.findById.mockResolvedValue(mockSoilType);
      mockIrrigationTypesRepository.findById.mockResolvedValue(
        mockIrrigationType,
      );
      mockAreasRepository.create.mockResolvedValue(mockArea);

      const result = await service.create(mockAreaRequestDto);

      expect(producersRepository.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.producerId,
      );
      expect(soilTypesRepository.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.soilTypeId,
      );
      expect(irrigationTypesRepository.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.irrigationTypeId,
      );
      expect(areasRepository.create).toHaveBeenCalledWith(mockAreaRequestDto);
      expect(result).toEqual(mockArea);
    });

    it('should throw NotFoundException when producer is not found', async () => {
      mockProducersRepository.findById.mockResolvedValue(null);

      await expect(service.create(mockAreaRequestDto)).rejects.toThrow(
        new NotFoundException('Produtor não encontrado'),
      );
      expect(producersRepository.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.producerId,
      );
      expect(soilTypesRepository.findById).not.toHaveBeenCalled();
      expect(irrigationTypesRepository.findById).not.toHaveBeenCalled();
      expect(areasRepository.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when soil type is not found', async () => {
      mockProducersRepository.findById.mockResolvedValue(mockProducer);
      mockSoilTypesRepository.findById.mockResolvedValue(null);

      await expect(service.create(mockAreaRequestDto)).rejects.toThrow(
        new NotFoundException('Tipo de solo não encontrado'),
      );
      expect(producersRepository.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.producerId,
      );
      expect(soilTypesRepository.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.soilTypeId,
      );
      expect(irrigationTypesRepository.findById).not.toHaveBeenCalled();
      expect(areasRepository.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when irrigation type is not found', async () => {
      mockProducersRepository.findById.mockResolvedValue(mockProducer);
      mockSoilTypesRepository.findById.mockResolvedValue(mockSoilType);
      mockIrrigationTypesRepository.findById.mockResolvedValue(null);

      await expect(service.create(mockAreaRequestDto)).rejects.toThrow(
        new NotFoundException('Tipo de irrigação não encontrado'),
      );
      expect(producersRepository.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.producerId,
      );
      expect(soilTypesRepository.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.soilTypeId,
      );
      expect(irrigationTypesRepository.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.irrigationTypeId,
      );
      expect(areasRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update area status successfully', async () => {
      const areaId = 1;
      const updateDto: UpdateAreaStatusDto = { ativo: false };
      const updatedArea = {
        ...mockArea,
        ativo: false,
        updatedAt: new Date('2023-01-02'),
      };

      mockAreasRepository.findById.mockResolvedValue(mockArea);
      mockAreasRepository.updateStatus.mockResolvedValue(updatedArea);

      const result = await service.updateStatus(areaId, updateDto);

      expect(areasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(areasRepository.updateStatus).toHaveBeenCalledWith(
        areaId,
        updateDto.ativo,
      );
      expect(result).toEqual(updatedArea);
    });

    it('should throw NotFoundException when area is not found', async () => {
      const areaId = 999;
      const updateDto: UpdateAreaStatusDto = { ativo: false };

      mockAreasRepository.findById.mockResolvedValue(null);

      await expect(service.updateStatus(areaId, updateDto)).rejects.toThrow(
        new NotFoundException('Área não encontrada'),
      );
      expect(areasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(areasRepository.updateStatus).not.toHaveBeenCalled();
    });

    it('should return existing area when status is already the desired one (idempotence)', async () => {
      const areaId = 1;
      const updateDto: UpdateAreaStatusDto = { ativo: true }; // área já está ativa

      mockAreasRepository.findById.mockResolvedValue(mockArea);

      const result = await service.updateStatus(areaId, updateDto);

      expect(areasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(areasRepository.updateStatus).not.toHaveBeenCalled(); // não deve chamar update
      expect(result).toEqual(mockArea);
    });

    it('should update status from active to inactive', async () => {
      const areaId = 1;
      const updateDto: UpdateAreaStatusDto = { ativo: false };
      const updatedArea = {
        ...mockArea,
        ativo: false,
        updatedAt: new Date('2023-01-02'),
      };

      mockAreasRepository.findById.mockResolvedValue(mockArea);
      mockAreasRepository.updateStatus.mockResolvedValue(updatedArea);

      const result = await service.updateStatus(areaId, updateDto);

      expect(areasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(areasRepository.updateStatus).toHaveBeenCalledWith(areaId, false);
      expect(result).toEqual(updatedArea);
    });

    it('should update status from inactive to active', async () => {
      const areaId = 1;
      const updateDto: UpdateAreaStatusDto = { ativo: true };
      const inactiveArea = { ...mockArea, ativo: false };
      const activatedArea = {
        ...mockArea,
        ativo: true,
        updatedAt: new Date('2023-01-02'),
      };

      mockAreasRepository.findById.mockResolvedValue(inactiveArea);
      mockAreasRepository.updateStatus.mockResolvedValue(activatedArea);

      const result = await service.updateStatus(areaId, updateDto);

      expect(areasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(areasRepository.updateStatus).toHaveBeenCalledWith(areaId, true);
      expect(result).toEqual(activatedArea);
    });
  });
});
