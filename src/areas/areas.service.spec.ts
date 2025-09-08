import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreasRepository } from './areas.repository';
import { ProducersService } from '../producers/producers.service';
import { SoilTypesService } from '../soil-types/soil-types.service';
import { IrrigationTypesService } from '../irrigation-types/irrigation-types.service';
import { AreaRequestDto } from './dto/area-request.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
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
  findOne: jest.MockedFunction<(id: number) => Promise<MockArea | null>>;
  update: jest.MockedFunction<(id: number, dto: UpdateAreaDto) => Promise<MockArea>>;
  updateStatus: jest.MockedFunction<
    (id: number, isActive: boolean) => Promise<MockArea>
  >;
}

interface MockProducersService {
  findOne: jest.MockedFunction<(id: number) => Promise<MockProducer | null>>;
}

interface MockSoilTypesService {
  findById: jest.MockedFunction<(id: number) => Promise<MockSoilType | null>>;
}

interface MockIrrigationTypesService {
  findById: jest.MockedFunction<
    (id: number) => Promise<MockIrrigationType | null>
  >;
}

describe('AreasService', () => {
  let service: AreasService;

  const mockAreasRepository: MockAreasRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
  };

  const mockProducersService: MockProducersService = {
    findOne: jest.fn(),
  };

  const mockSoilTypesService: MockSoilTypesService = {
    findById: jest.fn(),
  };

  const mockIrrigationTypesService: MockIrrigationTypesService = {
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
          provide: ProducersService,
          useValue: mockProducersService,
        },
        {
          provide: SoilTypesService,
          useValue: mockSoilTypesService,
        },
        {
          provide: IrrigationTypesService,
          useValue: mockIrrigationTypesService,
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
      mockProducersService.findOne.mockResolvedValue(mockProducer);
      mockSoilTypesService.findById.mockResolvedValue(mockSoilType);
      mockIrrigationTypesService.findById.mockResolvedValue(
        mockIrrigationType,
      );
      mockAreasRepository.create.mockResolvedValue(mockArea);

      const result = (await service.create(mockAreaRequestDto)) as MockArea;

      expect(mockProducersService.findOne).toHaveBeenCalledWith(
        mockAreaRequestDto.producerId,
      );
      expect(mockSoilTypesService.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.soilTypeId,
      );
      expect(mockIrrigationTypesService.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.irrigationTypeId,
      );
      expect(mockAreasRepository.create).toHaveBeenCalledWith(
        mockAreaRequestDto,
      );
      expect(result).toEqual(mockArea);
    });

    it('should throw NotFoundException when producer is not found', async () => {
      mockProducersService.findOne.mockRejectedValue(
        new NotFoundException('Produtor não encontrado')
      );

      await expect(service.create(mockAreaRequestDto)).rejects.toThrow(
        new NotFoundException('Produtor não encontrado'),
      );
      expect(mockProducersService.findOne).toHaveBeenCalledWith(
        mockAreaRequestDto.producerId,
      );
      expect(mockSoilTypesService.findById).not.toHaveBeenCalled();
      expect(mockIrrigationTypesService.findById).not.toHaveBeenCalled();
      expect(mockAreasRepository.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when soil type is not found', async () => {
      mockProducersService.findOne.mockResolvedValue(mockProducer);
      mockSoilTypesService.findById.mockRejectedValue(
        new NotFoundException('Tipo de solo não encontrado')
      );

      await expect(service.create(mockAreaRequestDto)).rejects.toThrow(
        new NotFoundException('Tipo de solo não encontrado'),
      );
      expect(mockProducersService.findOne).toHaveBeenCalledWith(
        mockAreaRequestDto.producerId,
      );
      expect(mockSoilTypesService.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.soilTypeId,
      );
      expect(mockIrrigationTypesService.findById).not.toHaveBeenCalled();
      expect(mockAreasRepository.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when irrigation type is not found', async () => {
      mockProducersService.findOne.mockResolvedValue(mockProducer);
      mockSoilTypesService.findById.mockResolvedValue(mockSoilType);
      mockIrrigationTypesService.findById.mockRejectedValue(
        new NotFoundException('Tipo de irrigação não encontrado')
      );

      await expect(service.create(mockAreaRequestDto)).rejects.toThrow(
        new NotFoundException('Tipo de irrigação não encontrado'),
      );
      expect(mockProducersService.findOne).toHaveBeenCalledWith(
        mockAreaRequestDto.producerId,
      );
      expect(mockSoilTypesService.findById).toHaveBeenCalledWith(
        mockAreaRequestDto.soilTypeId,
      );
      expect(mockIrrigationTypesService.findById).toHaveBeenCalledWith(
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

  describe('update', () => {
    it('should update area successfully when area exists', async () => {
      const areaId = 1;
      const updateDto: UpdateAreaDto = {
        name: 'Área Atualizada',
        soilTypeId: 2,
        irrigationTypeId: 3,
        isActive: false,
      };
      const updatedArea: MockArea = {
        ...mockArea,
        name: 'Área Atualizada',
        soilTypeId: 2,
        irrigationTypeId: 3,
        isActive: false,
        updatedAt: new Date('2023-01-02'),
      };

      mockAreasRepository.findById.mockResolvedValue(mockArea);
      mockAreasRepository.update.mockResolvedValue(updatedArea);

      const result = await service.update(areaId, updateDto);

      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.update).toHaveBeenCalledWith(areaId, updateDto);
      expect(result).toEqual(updatedArea);
    });

    it('should throw NotFoundException when area does not exist', async () => {
      const areaId = 999;
      const updateDto: UpdateAreaDto = {
        name: 'Área Atualizada',
      };

      mockAreasRepository.findById.mockResolvedValue(null);

      await expect(service.update(areaId, updateDto)).rejects.toThrow(
        new NotFoundException(`Área com o ID ${areaId} não encontrada.`),
      );
      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.update).not.toHaveBeenCalled();
    });

    it('should update area with partial data', async () => {
      const areaId = 1;
      const updateDto: UpdateAreaDto = {
        name: 'Apenas Nome Atualizado',
      };
      const updatedArea: MockArea = {
        ...mockArea,
        name: 'Apenas Nome Atualizado',
        updatedAt: new Date('2023-01-02'),
      };

      mockAreasRepository.findById.mockResolvedValue(mockArea);
      mockAreasRepository.update.mockResolvedValue(updatedArea);

      const result = await service.update(areaId, updateDto);

      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.update).toHaveBeenCalledWith(areaId, updateDto);
      expect(result).toEqual(updatedArea);
    });

    it('should update only isActive field', async () => {
      const areaId = 1;
      const updateDto: UpdateAreaDto = {
        isActive: false,
      };
      const updatedArea: MockArea = {
        ...mockArea,
        isActive: false,
        updatedAt: new Date('2023-01-02'),
      };

      mockAreasRepository.findById.mockResolvedValue(mockArea);
      mockAreasRepository.update.mockResolvedValue(updatedArea);

      const result = await service.update(areaId, updateDto);

      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.update).toHaveBeenCalledWith(areaId, updateDto);
      expect(result).toEqual(updatedArea);
    });

    it('should update only soilTypeId and irrigationTypeId', async () => {
      const areaId = 1;
      const updateDto: UpdateAreaDto = {
        soilTypeId: 5,
        irrigationTypeId: 6,
      };
      const updatedArea: MockArea = {
        ...mockArea,
        soilTypeId: 5,
        irrigationTypeId: 6,
        updatedAt: new Date('2023-01-02'),
      };

      mockAreasRepository.findById.mockResolvedValue(mockArea);
      mockAreasRepository.update.mockResolvedValue(updatedArea);

      const result = await service.update(areaId, updateDto);

      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.update).toHaveBeenCalledWith(areaId, updateDto);
      expect(result).toEqual(updatedArea);
    });

    it('should update all fields at once', async () => {
      const areaId = 1;
      const updateDto: UpdateAreaDto = {
        name: 'Completamente Atualizada',
        soilTypeId: 10,
        irrigationTypeId: 11,
        isActive: false,
      };
      const updatedArea: MockArea = {
        ...mockArea,
        name: 'Completamente Atualizada',
        soilTypeId: 10,
        irrigationTypeId: 11,
        isActive: false,
        updatedAt: new Date('2023-01-02'),
      };

      mockAreasRepository.findById.mockResolvedValue(mockArea);
      mockAreasRepository.update.mockResolvedValue(updatedArea);

      const result = await service.update(areaId, updateDto);

      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.update).toHaveBeenCalledWith(areaId, updateDto);
      expect(result).toEqual(updatedArea);
    });
  });
});
