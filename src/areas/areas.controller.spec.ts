import { Test, TestingModule } from '@nestjs/testing';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import { AreaRequestDto } from './dto/area-request.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { UpdateAreaStatusDto } from './dto/update-area-status.dto';

describe('AreasController', () => {
  let controller: AreasController;
  let service: AreasService;

  const mockAreaService = {
    create: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
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

  const mockUpdateAreaStatusDto: UpdateAreaStatusDto = {
    isActive: false,
  };

  const mockAreaResponse = {
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

  const mockUpdateAreaDto: UpdateAreaDto = {
    name: 'Área Atualizada',
    soilTypeId: 2,
    irrigationTypeId: 3,
    isActive: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AreasController],
      providers: [
        {
          provide: AreasService,
          useValue: mockAreaService,
        },
      ],
    }).compile();

    controller = module.get<AreasController>(AreasController);
    service = module.get<AreasService>(AreasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new area successfully', async () => {
      mockAreaService.create.mockResolvedValue(mockAreaResponse);

      const result = await controller.create(mockAreaRequestDto);

      expect(service.create).toHaveBeenCalledWith(mockAreaRequestDto);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockAreaResponse);
    });

    it('should handle service errors when creating area', async () => {
      const error = new Error('Service error');
      mockAreaService.create.mockRejectedValue(error);

      await expect(controller.create(mockAreaRequestDto)).rejects.toThrow(
        'Service error',
      );
      expect(service.create).toHaveBeenCalledWith(mockAreaRequestDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateStatus', () => {
    it('should update area status successfully', async () => {
      const areaId = 1;
      const updatedAreaResponse = {
        ...mockAreaResponse,
        isActive: false,
        updatedAt: new Date('2023-01-02'),
      };
      mockAreaService.updateStatus.mockResolvedValue(updatedAreaResponse);

      const result = await controller.updateStatus(
        areaId,
        mockUpdateAreaStatusDto,
      );

      expect(service.updateStatus).toHaveBeenCalledWith(
        areaId,
        mockUpdateAreaStatusDto,
      );
      expect(service.updateStatus).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedAreaResponse);
    });

    it('should handle service errors when updating area status', async () => {
      const areaId = 1;
      const error = new Error('Area not found');
      mockAreaService.updateStatus.mockRejectedValue(error);

      await expect(
        controller.updateStatus(areaId, mockUpdateAreaStatusDto),
      ).rejects.toThrow('Area not found');
      expect(service.updateStatus).toHaveBeenCalledWith(
        areaId,
        mockUpdateAreaStatusDto,
      );
      expect(service.updateStatus).toHaveBeenCalledTimes(1);
    });

    it('should return area when status is already the desired one (idempotence)', async () => {
      const areaId = 1;
      const activeUpdateDto: UpdateAreaStatusDto = { isActive: true };
      mockAreaService.updateStatus.mockResolvedValue(mockAreaResponse);

      const result = await controller.updateStatus(areaId, activeUpdateDto);

      expect(service.updateStatus).toHaveBeenCalledWith(
        areaId,
        activeUpdateDto,
      );
      expect(service.updateStatus).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockAreaResponse);
    });
  });

  describe('update', () => {
    it('should update area successfully', async () => {
      const areaId = 1;
      const updatedAreaResponse = {
        ...mockAreaResponse,
        name: 'Área Atualizada',
        soilTypeId: 2,
        irrigationTypeId: 3,
        isActive: false,
        updatedAt: new Date('2023-01-02'),
      };
      mockAreaService.update.mockResolvedValue(updatedAreaResponse);

      const result = await controller.update(areaId, mockUpdateAreaDto);

      expect(service.update).toHaveBeenCalledWith(areaId, mockUpdateAreaDto);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedAreaResponse);
    });

    it('should handle service errors when updating area', async () => {
      const areaId = 1;
      const error = new Error('Area not found');
      mockAreaService.update.mockRejectedValue(error);

      await expect(controller.update(areaId, mockUpdateAreaDto)).rejects.toThrow(
        'Area not found',
      );
      expect(service.update).toHaveBeenCalledWith(areaId, mockUpdateAreaDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should update area with partial data', async () => {
      const areaId = 1;
      const partialUpdateDto: UpdateAreaDto = {
        name: 'Apenas Nome Atualizado',
      };
      const updatedAreaResponse = {
        ...mockAreaResponse,
        name: 'Apenas Nome Atualizado',
        updatedAt: new Date('2023-01-02'),
      };
      mockAreaService.update.mockResolvedValue(updatedAreaResponse);

      const result = await controller.update(areaId, partialUpdateDto);

      expect(service.update).toHaveBeenCalledWith(areaId, partialUpdateDto);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedAreaResponse);
    });

    it('should update area with only isActive field', async () => {
      const areaId = 1;
      const statusOnlyUpdateDto: UpdateAreaDto = {
        isActive: false,
      };
      const updatedAreaResponse = {
        ...mockAreaResponse,
        isActive: false,
        updatedAt: new Date('2023-01-02'),
      };
      mockAreaService.update.mockResolvedValue(updatedAreaResponse);

      const result = await controller.update(areaId, statusOnlyUpdateDto);

      expect(service.update).toHaveBeenCalledWith(areaId, statusOnlyUpdateDto);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedAreaResponse);
    });
  });
});
