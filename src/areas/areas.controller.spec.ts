import { Test, TestingModule } from '@nestjs/testing';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import { AreaRequestDto } from './dto/area-request.dto';
import { UpdateAreaStatusDto } from './dto/update-area-status.dto';

describe('AreasController', () => {
  let controller: AreasController;
  let service: AreasService;

  const mockAreaService = {
    create: jest.fn(),
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
    ativo: false,
  };

  const mockAreaResponse = {
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
        ativo: false,
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
      const activeUpdateDto: UpdateAreaStatusDto = { ativo: true };
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
});
