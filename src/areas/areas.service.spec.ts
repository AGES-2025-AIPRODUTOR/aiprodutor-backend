import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreasRepository } from './areas.repository';
import { ProducersRepository } from '../producers/producers.repository';
import { SoilTypesRepository } from '../soil-types/soil-types.repository';
import { IrrigationTypesRepository } from '../irrigation-types/irrigation-types.repository';
import { AreaRequestDto } from './dto/area-request.dto';
import { UpdateAreaStatusDto } from './dto/update-area-status.dto';

// Type interfaces for type safety
interface MockArea {
  id: number;
  name: string;
  producerId: number;
  soilTypeId: number;
  irrigationTypeId: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  polygon: any;
}

interface MockProducer {
  id: number;
  name: string;
  document: string;
  email: string;
}

interface MockSoilType {
  id: number;
  name: string;
}

interface MockIrrigationType {
  id: number;
  name: string;
}

interface MockAreasRepository {
  create: jest.MockedFunction<(dto: AreaRequestDto) => Promise<MockArea>>;
  findById: jest.MockedFunction<(id: number) => Promise<MockArea | null>>;
  updateStatus: jest.MockedFunction<
    (id: number, isActive: boolean) => Promise<MockArea>
  >;
}

interface MockProducersRepository {
  findById: jest.MockedFunction<(id: number) => Promise<MockProducer | null>>;
}

interface MockSoilTypesRepository {
  findById: jest.MockedFunction<(id: number) => Promise<MockSoilType | null>>;
}

interface MockIrrigationTypesRepository {
  findById: jest.MockedFunction<
    (id: number) => Promise<MockIrrigationType | null>
  >;
}

describe('AreasService', () => {
  let service: AreasService;

  const mockAreasRepository: MockAreasRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    updateStatus: jest.fn(),
  };

  const mockProducersRepository: MockProducersRepository = {
    findById: jest.fn(),
  };

  const mockSoilTypesRepository: MockSoilTypesRepository = {
    findById: jest.fn(),
  };

  const mockIrrigationTypesRepository: MockIrrigationTypesRepository = {
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

  const mockProducer: MockProducer = {
    id: 1,
    name: 'Produtor Teste',
    document: '12345678901',
    email: 'produtor@teste.com',
  };

  const mockSoilType: MockSoilType = {
    id: 1,
    name: 'Tipo de Solo Teste',
  };

  const mockIrrigationType: MockIrrigationType = {
    id: 1,
    name: 'Tipo de Irrigação Teste',
  };

  const mockArea: MockArea = {
    id: 1,
    name: 'Área de Teste',
    producerId: 1,
    soilTypeId: 1,
    irrigationTypeId: 1,
    isActive: true,
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

      const result = (await service.create(mockAreaRequestDto)) as MockArea;

      expect(mockProducersRepository.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.producerId,
      );
      expect(mockSoilTypesRepository.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.soilTypeId,
      );
      expect(mockIrrigationTypesRepository.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.irrigationTypeId,
      );
      expect(mockAreasRepository.create).toHaveBeenCalledWith(
        mockAreaRequestDto,
      );
      expect(result).toEqual(mockArea);
    });

    it('should throw NotFoundException when producer is not found', async () => {
      mockProducersRepository.findById.mockResolvedValue(null);

      await expect(service.create(mockAreaRequestDto)).rejects.toThrow(
        new NotFoundException('Produtor não encontrado'),
      );
      expect(mockProducersRepository.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.producerId,
      );
      expect(mockSoilTypesRepository.findById).not.toHaveBeenCalled();
      expect(mockIrrigationTypesRepository.findById).not.toHaveBeenCalled();
      expect(mockAreasRepository.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when soil type is not found', async () => {
      mockProducersRepository.findById.mockResolvedValue(mockProducer);
      mockSoilTypesRepository.findById.mockResolvedValue(null);

      await expect(service.create(mockAreaRequestDto)).rejects.toThrow(
        new NotFoundException('Tipo de solo não encontrado'),
      );
      expect(mockProducersRepository.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.producerId,
      );
      expect(mockSoilTypesRepository.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.soilTypeId,
      );
      expect(mockIrrigationTypesRepository.findById).not.toHaveBeenCalled();
      expect(mockAreasRepository.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when irrigation type is not found', async () => {
      mockProducersRepository.findById.mockResolvedValue(mockProducer);
      mockSoilTypesRepository.findById.mockResolvedValue(mockSoilType);
      mockIrrigationTypesRepository.findById.mockResolvedValue(null);

      await expect(service.create(mockAreaRequestDto)).rejects.toThrow(
        new NotFoundException('Tipo de irrigação não encontrado'),
      );
      expect(mockProducersRepository.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.producerId,
      );
      expect(mockSoilTypesRepository.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.soilTypeId,
      );
      expect(mockIrrigationTypesRepository.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.irrigationTypeId,
      );
      expect(mockAreasRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update area status successfully', async () => {
      const areaId = 1;
      const updateDto: UpdateAreaStatusDto = { isActive: false };
      const updatedArea = {
        ...mockArea,
        isActive: false,
        updatedAt: new Date('2023-01-02'),
      };

      mockAreasRepository.findById.mockResolvedValue(mockArea);
      mockAreasRepository.updateStatus.mockResolvedValue(updatedArea);

      const result = (await service.updateStatus(
        areaId,
        updateDto,
      )) as MockArea;

      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.updateStatus).toHaveBeenCalledWith(
        areaId,
        updateDto.isActive,
      );
      expect(result).toEqual(updatedArea);
    });

    it('should throw NotFoundException when area is not found', async () => {
      const areaId = 999;
      const updateDto: UpdateAreaStatusDto = { isActive: false };

      mockAreasRepository.findById.mockResolvedValue(null);

      await expect(service.updateStatus(areaId, updateDto)).rejects.toThrow(
        new NotFoundException('Área não encontrada'),
      );
      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.updateStatus).not.toHaveBeenCalled();
    });

    it('should return existing area when status is already the desired one (idempotence)', async () => {
      const areaId = 1;
      const updateDto: UpdateAreaStatusDto = { isActive: true }; // área já está ativa

      mockAreasRepository.findById.mockResolvedValue(mockArea);

      const result = (await service.updateStatus(
        areaId,
        updateDto,
      )) as MockArea;

      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.updateStatus).not.toHaveBeenCalled(); // não deve chamar update
      expect(result).toEqual(mockArea);
    });

    it('should update status from active to inactive', async () => {
      const areaId = 1;
      const updateDto: UpdateAreaStatusDto = { isActive: false };
      const updatedArea = {
        ...mockArea,
        isActive: false,
        updatedAt: new Date('2023-01-02'),
      };

      mockAreasRepository.findById.mockResolvedValue(mockArea);
      mockAreasRepository.updateStatus.mockResolvedValue(updatedArea);

      const result = (await service.updateStatus(
        areaId,
        updateDto,
      )) as MockArea;

      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.updateStatus).toHaveBeenCalledWith(
        areaId,
        false,
      );
      expect(result).toEqual(updatedArea);
    });

    it('should update status from inactive to active', async () => {
      const areaId = 1;
      const updateDto: UpdateAreaStatusDto = { isActive: true };
      const inactiveArea = { ...mockArea, isActive: false };
      const activatedArea = {
        ...mockArea,
        isActive: true,
        updatedAt: new Date('2023-01-02'),
      };

      mockAreasRepository.findById.mockResolvedValue(inactiveArea);
      mockAreasRepository.updateStatus.mockResolvedValue(activatedArea);

      const result = (await service.updateStatus(
        areaId,
        updateDto,
      )) as MockArea;

      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.updateStatus).toHaveBeenCalledWith(
        areaId,
        true,
      );
      expect(result).toEqual(activatedArea);
    });
  });
});
