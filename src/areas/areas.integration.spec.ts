import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AreasModule } from './areas.module';
import { AreasService } from './areas.service';
import { AreasRepository } from './areas.repository';
import { ProducersRepository } from '../producers/producers.repository';
import { SoilTypesRepository } from '../soil-types/soil-types.repository';
import { IrrigationTypesRepository } from '../irrigation-types/irrigation-types.repository';
import { PrismaService } from '../shared/prisma/prisma.service';

// Mock do geojson-validation para testes de integração
jest.mock('geojson-validation', () => ({
  isPolygon: jest.fn(),
}));

import geojsonValidation from 'geojson-validation';

describe('AreasController (e2e)', () => {
  let app: INestApplication;
  let areasService: AreasService;
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

  const mockPrismaService = {
    $queryRawUnsafe: jest.fn(),
    area: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockValidAreaRequestDto = {
    name: 'Área de Teste E2E',
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
    name: 'Área de Teste E2E',
    producerId: 1,
    soilTypeId: 1,
    irrigationTypeId: 1,
    ativo: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    polygon: mockValidAreaRequestDto.polygon,
  };

  beforeEach(async () => {
    // Setup do mock geojson-validation
    (geojsonValidation.isPolygon as jest.Mock).mockReturnValue(true);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AreasModule],
    })
      .overrideProvider(AreasRepository)
      .useValue(mockAreasRepository)
      .overrideProvider(ProducersRepository)
      .useValue(mockProducersRepository)
      .overrideProvider(SoilTypesRepository)
      .useValue(mockSoilTypesRepository)
      .overrideProvider(IrrigationTypesRepository)
      .useValue(mockIrrigationTypesRepository)
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    areasService = moduleFixture.get<AreasService>(AreasService);
    areasRepository = moduleFixture.get<AreasRepository>(AreasRepository);
    producersRepository =
      moduleFixture.get<ProducersRepository>(ProducersRepository);
    soilTypesRepository =
      moduleFixture.get<SoilTypesRepository>(SoilTypesRepository);
    irrigationTypesRepository = moduleFixture.get<IrrigationTypesRepository>(
      IrrigationTypesRepository,
    );

    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  describe('POST /areas', () => {
    it('should create a new area successfully', async () => {
      mockProducersRepository.findById.mockResolvedValue(mockProducer);
      mockSoilTypesRepository.findById.mockResolvedValue(mockSoilType);
      mockIrrigationTypesRepository.findById.mockResolvedValue(
        mockIrrigationType,
      );
      mockAreasRepository.create.mockResolvedValue(mockArea);

      const response = await request(app.getHttpServer())
        .post('/areas')
        .send(mockValidAreaRequestDto)
        .expect(201);

      expect(response.body).toEqual(mockArea);
      expect(mockProducersRepository.findById).toHaveBeenCalledWith(1);
      expect(mockSoilTypesRepository.findById).toHaveBeenCalledWith(1);
      expect(mockIrrigationTypesRepository.findById).toHaveBeenCalledWith(1);
      expect(mockAreasRepository.create).toHaveBeenCalledWith(
        mockValidAreaRequestDto,
      );
    });

    it('should return 404 when producer is not found', async () => {
      mockProducersRepository.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .post('/areas')
        .send(mockValidAreaRequestDto)
        .expect(404);

      expect(response.body.message).toBe('Produtor não encontrado');
      expect(mockProducersRepository.findById).toHaveBeenCalledWith(1);
      expect(mockSoilTypesRepository.findById).not.toHaveBeenCalled();
      expect(mockIrrigationTypesRepository.findById).not.toHaveBeenCalled();
      expect(mockAreasRepository.create).not.toHaveBeenCalled();
    });

    it('should return 404 when soil type is not found', async () => {
      mockProducersRepository.findById.mockResolvedValue(mockProducer);
      mockSoilTypesRepository.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .post('/areas')
        .send(mockValidAreaRequestDto)
        .expect(404);

      expect(response.body.message).toBe('Tipo de solo não encontrado');
      expect(mockProducersRepository.findById).toHaveBeenCalledWith(1);
      expect(mockSoilTypesRepository.findById).toHaveBeenCalledWith(1);
      expect(mockIrrigationTypesRepository.findById).not.toHaveBeenCalled();
      expect(mockAreasRepository.create).not.toHaveBeenCalled();
    });

    it('should return 404 when irrigation type is not found', async () => {
      mockProducersRepository.findById.mockResolvedValue(mockProducer);
      mockSoilTypesRepository.findById.mockResolvedValue(mockSoilType);
      mockIrrigationTypesRepository.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .post('/areas')
        .send(mockValidAreaRequestDto)
        .expect(404);

      expect(response.body.message).toBe('Tipo de irrigação não encontrado');
      expect(mockProducersRepository.findById).toHaveBeenCalledWith(1);
      expect(mockSoilTypesRepository.findById).toHaveBeenCalledWith(1);
      expect(mockIrrigationTypesRepository.findById).toHaveBeenCalledWith(1);
      expect(mockAreasRepository.create).not.toHaveBeenCalled();
    });

    it('should return 400 when name is missing', async () => {
      const invalidDto = {
        producerId: mockValidAreaRequestDto.producerId,
        soilTypeId: mockValidAreaRequestDto.soilTypeId,
        irrigationTypeId: mockValidAreaRequestDto.irrigationTypeId,
        polygon: mockValidAreaRequestDto.polygon,
      };

      const response = await request(app.getHttpServer())
        .post('/areas')
        .send(invalidDto)
        .expect(400);

      expect(response.body.message).toContain('name should not be empty');
      expect(mockProducersRepository.findById).not.toHaveBeenCalled();
    });

    it('should return 400 when producerId is not an integer', async () => {
      const invalidDto = { ...mockValidAreaRequestDto, producerId: 'invalid' };

      const response = await request(app.getHttpServer())
        .post('/areas')
        .send(invalidDto)
        .expect(400);

      expect(response.body.message).toContain(
        'producerId must be an integer number',
      );
      expect(mockProducersRepository.findById).not.toHaveBeenCalled();
    });

    it('should return 400 when polygon is invalid', async () => {
      // Configure mock para retornar false para polígono inválido
      (geojsonValidation.isPolygon as jest.Mock).mockReturnValue(false);

      const invalidDto = {
        ...mockValidAreaRequestDto,
        polygon: { type: 'Point', coordinates: [0, 0] },
      };

      const response = await request(app.getHttpServer())
        .post('/areas')
        .send(invalidDto)
        .expect(400);

      expect(response.body.message).toContain(
        'O campo polygon deve ser um GeoJSON Polygon válido.',
      );
      expect(mockProducersRepository.findById).not.toHaveBeenCalled();
      // geojsonValidation.isPolygon não é chamado para tipos Point, pois o validador rejeita antes
    });

    it('should return 400 when polygon is missing', async () => {
      const invalidDto = {
        name: mockValidAreaRequestDto.name,
        producerId: mockValidAreaRequestDto.producerId,
        soilTypeId: mockValidAreaRequestDto.soilTypeId,
        irrigationTypeId: mockValidAreaRequestDto.irrigationTypeId,
      };

      const response = await request(app.getHttpServer())
        .post('/areas')
        .send(invalidDto)
        .expect(400);

      expect(response.body.message).toContain('polygon should not be empty');
      expect(mockProducersRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe('PATCH /areas/:id/status', () => {
    it('should update area status successfully', async () => {
      const areaId = 1;
      const updateDto = { ativo: false };
      const updatedArea = {
        ...mockArea,
        ativo: false,
        updatedAt: '2023-01-02T00:00:00.000Z',
      };

      mockAreasRepository.findById.mockResolvedValue(mockArea);
      mockAreasRepository.updateStatus.mockResolvedValue(updatedArea);

      const response = await request(app.getHttpServer())
        .patch(`/areas/${areaId}/status`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toEqual(updatedArea);
      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.updateStatus).toHaveBeenCalledWith(
        areaId,
        false,
      );
    });

    it('should return 404 when area is not found', async () => {
      const areaId = 999;
      const updateDto = { ativo: false };

      mockAreasRepository.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .patch(`/areas/${areaId}/status`)
        .send(updateDto)
        .expect(404);

      expect(response.body.message).toBe('Área não encontrada');
      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.updateStatus).not.toHaveBeenCalled();
    });

    it('should return area when status is already the desired one (idempotence)', async () => {
      const areaId = 1;
      const updateDto = { ativo: true }; // área já está ativa

      mockAreasRepository.findById.mockResolvedValue(mockArea);

      const response = await request(app.getHttpServer())
        .patch(`/areas/${areaId}/status`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toEqual(mockArea);
      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.updateStatus).not.toHaveBeenCalled();
    });

    it('should return 400 when ativo is not a boolean', async () => {
      const areaId = 1;
      const invalidDto = { ativo: 'true' };

      const response = await request(app.getHttpServer())
        .patch(`/areas/${areaId}/status`)
        .send(invalidDto)
        .expect(400);

      expect(response.body.message).toContain('ativo must be a boolean value');
      expect(mockAreasRepository.findById).not.toHaveBeenCalled();
    });

    it('should return 400 when ativo is missing', async () => {
      const areaId = 1;
      const invalidDto = {};

      const response = await request(app.getHttpServer())
        .patch(`/areas/${areaId}/status`)
        .send(invalidDto)
        .expect(400);

      expect(response.body.message).toContain('ativo must be a boolean value');
      expect(mockAreasRepository.findById).not.toHaveBeenCalled();
    });

    it('should return 400 when id is not a number', async () => {
      const invalidId = 'invalid';
      const updateDto = { ativo: false };

      await request(app.getHttpServer())
        .patch(`/areas/${invalidId}/status`)
        .send(updateDto)
        .expect(400);

      expect(mockAreasRepository.findById).not.toHaveBeenCalled();
    });
  });
});
