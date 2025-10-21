/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import * as request from 'supertest';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import { AreasRepository } from './areas.repository';
import { ProducersService } from '../producers/producers.service';
import { SoilTypesService } from '../soil-types/soil-types.service';
import { IrrigationTypesService } from '../irrigation-types/irrigation-types.service';
import { PrismaService } from '../shared/prisma/prisma.service';

// Mock do geojson-validation para testes de integração
jest.mock('geojson-validation', () => ({
  default: {
    isPolygon: jest.fn(),
  },
  isPolygon: jest.fn(),
}));

import * as geojsonValidation from 'geojson-validation';
describe('AreasController (e2e)', () => {
  let app: INestApplication;

  const mockAreasRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
  };

  const mockProducersService = {
    findOne: jest.fn(),
  };

  const mockSoilTypesService = {
    findById: jest.fn(),
  };

  const mockIrrigationTypesService = {
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
    color: '#34A853',
    areaM2: 15700.5,
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
    color: '#34A853',
    areaM2: 15700.5,
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    polygon: mockValidAreaRequestDto.polygon,
  };

  beforeEach(async () => {
    // Setup do mock geojson-validation
    (geojsonValidation.isPolygon as jest.Mock).mockReturnValue(true);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AreasController],
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
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    if (app) {
      await app.close();
    }
  });

  describe('POST /areas', () => {
    it('should create a new area successfully', async () => {
      mockProducersService.findOne.mockResolvedValue(mockProducer);
      mockSoilTypesService.findById.mockResolvedValue(mockSoilType);
      mockIrrigationTypesService.findById.mockResolvedValue(mockIrrigationType);
      mockAreasRepository.create.mockResolvedValue(mockArea);

      const response = await request(app.getHttpServer())
        .post('/areas')
        .send(mockValidAreaRequestDto);

      if (response.status !== 201) {
        console.log('Response status:', response.status);
        console.log('Response body:', response.body);
      }

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockArea);
      expect(mockProducersService.findOne).toHaveBeenCalledWith(1);
      expect(mockSoilTypesService.findById).toHaveBeenCalledWith(1);
      expect(mockIrrigationTypesService.findById).toHaveBeenCalledWith(1);
      expect(mockAreasRepository.create).toHaveBeenCalledWith(
        mockValidAreaRequestDto,
      );
    });

    it('should return 404 when producer is not found', async () => {
      mockProducersService.findOne.mockRejectedValue(
        new NotFoundException('Produtor não encontrado'),
      );

      const response = await request(app.getHttpServer())
        .post('/areas')
        .send(mockValidAreaRequestDto)
        .expect(404);

      expect(response.body.message).toBe('Produtor não encontrado');
      expect(mockProducersService.findOne).toHaveBeenCalledWith(1);
      expect(mockSoilTypesService.findById).not.toHaveBeenCalled();
      expect(mockIrrigationTypesService.findById).not.toHaveBeenCalled();
      expect(mockAreasRepository.create).not.toHaveBeenCalled();
    });

    it('should return 404 when soil type is not found', async () => {
      mockProducersService.findOne.mockResolvedValue(mockProducer);
      mockSoilTypesService.findById.mockRejectedValue(
        new NotFoundException('Tipo de solo não encontrado'),
      );

      const response = await request(app.getHttpServer())
        .post('/areas')
        .send(mockValidAreaRequestDto)
        .expect(404);

      expect(response.body.message).toBe('Tipo de solo não encontrado');
      expect(mockProducersService.findOne).toHaveBeenCalledWith(1);
      expect(mockSoilTypesService.findById).toHaveBeenCalledWith(1);
      expect(mockIrrigationTypesService.findById).not.toHaveBeenCalled();
      expect(mockAreasRepository.create).not.toHaveBeenCalled();
    });

    it('should return 404 when irrigation type is not found', async () => {
      mockProducersService.findOne.mockResolvedValue(mockProducer);
      mockSoilTypesService.findById.mockResolvedValue(mockSoilType);
      mockIrrigationTypesService.findById.mockRejectedValue(
        new NotFoundException('Tipo de irrigação não encontrado'),
      );

      const response = await request(app.getHttpServer())
        .post('/areas')
        .send(mockValidAreaRequestDto)
        .expect(404);

      expect(response.body.message).toBe('Tipo de irrigação não encontrado');
      expect(mockProducersService.findOne).toHaveBeenCalledWith(1);
      expect(mockSoilTypesService.findById).toHaveBeenCalledWith(1);
      expect(mockIrrigationTypesService.findById).toHaveBeenCalledWith(1);
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
      expect(mockProducersService.findOne).not.toHaveBeenCalled();
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
      expect(mockProducersService.findOne).not.toHaveBeenCalled();
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
      expect(mockProducersService.findOne).not.toHaveBeenCalled();
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
      expect(mockProducersService.findOne).not.toHaveBeenCalled();
    });
  });

  describe('PATCH /areas/:id/status', () => {
    it('should update area status successfully', async () => {
      const areaId = 1;
      const updateDto = { isActive: false };
      const updatedArea = {
        ...mockArea,
        isActive: false,
        updatedAt: '2023-01-02',
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
      const updateDto = { isActive: false };

      mockAreasRepository.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .patch(`/areas/${areaId}/status`)
        .send(updateDto)
        .expect(404);

      expect(response.body.message).toBe(
        `Área com o ID ${areaId} não encontrada.`,
      );
      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.updateStatus).not.toHaveBeenCalled();
    });

    it('should return area when status is already the desired one (idempotence)', async () => {
      const areaId = 1;
      const updateDto = { isActive: true }; // área já está ativa

      mockAreasRepository.findById.mockResolvedValue(mockArea);

      const response = await request(app.getHttpServer())
        .patch(`/areas/${areaId}/status`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toEqual(mockArea);
      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.updateStatus).not.toHaveBeenCalled();
    });

    it('should return 400 when isActive is not a boolean', async () => {
      const areaId = 1;
      const invalidDto = { isActive: 'true' };

      const response = await request(app.getHttpServer())
        .patch(`/areas/${areaId}/status`)
        .send(invalidDto)
        .expect(400);

      expect(response.body.message).toContain(
        'isActive must be a boolean value',
      );
      expect(mockAreasRepository.findById).not.toHaveBeenCalled();
    });

    it('should return 400 when isActive is missing', async () => {
      const areaId = 1;
      const invalidDto = {};

      const response = await request(app.getHttpServer())
        .patch(`/areas/${areaId}/status`)
        .send(invalidDto)
        .expect(400);

      expect(response.body.message).toContain(
        'isActive must be a boolean value',
      );
      expect(mockAreasRepository.findById).not.toHaveBeenCalled();
    });

    it('should return 400 when id is not a number', async () => {
      const invalidId = 'invalid';
      const updateDto = { isActive: false };

      await request(app.getHttpServer())
        .patch(`/areas/${invalidId}/status`)
        .send(updateDto)
        .expect(400);

      expect(mockAreasRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe('PATCH /areas/:id', () => {
    it('should update area successfully', async () => {
      const areaId = 1;
      const updateDto = {
        name: 'Área Atualizada',
        soilTypeId: 2,
        irrigationTypeId: 3,
        isActive: false,
      };
      const updatedArea = {
        ...mockArea,
        name: 'Área Atualizada',
        soilTypeId: 2,
        irrigationTypeId: 3,
        isActive: false,
        updatedAt: '2023-01-02',
      };

      mockAreasRepository.findById.mockResolvedValue(mockArea);
      mockAreasRepository.update.mockResolvedValue(updatedArea);

      const response = await request(app.getHttpServer())
        .patch(`/areas/${areaId}`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toEqual(updatedArea);
      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.update).toHaveBeenCalledWith(
        areaId,
        updateDto,
      );
    });

    it('should return 404 when area is not found', async () => {
      const areaId = 999;
      const updateDto = {
        name: 'Área Atualizada',
      };

      mockAreasRepository.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .patch(`/areas/${areaId}`)
        .send(updateDto)
        .expect(404);

      expect(response.body.message).toBe('Área com o ID 999 não encontrada.');
      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.update).not.toHaveBeenCalled();
    });

    it('should update area with partial data (only name)', async () => {
      const areaId = 1;
      const updateDto = {
        name: 'Apenas Nome Atualizado',
      };
      const updatedArea = {
        ...mockArea,
        name: 'Apenas Nome Atualizado',
        updatedAt: '2023-01-02',
      };

      mockAreasRepository.findById.mockResolvedValue(mockArea);
      mockAreasRepository.update.mockResolvedValue(updatedArea);

      const response = await request(app.getHttpServer())
        .patch(`/areas/${areaId}`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toEqual(updatedArea);
      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.update).toHaveBeenCalledWith(
        areaId,
        updateDto,
      );
    });

    it('should update area with only isActive field', async () => {
      const areaId = 1;
      const updateDto = {
        isActive: false,
      };
      const updatedArea = {
        ...mockArea,
        isActive: false,
        updatedAt: '2023-01-02',
      };

      mockAreasRepository.findById.mockResolvedValue(mockArea);
      mockAreasRepository.update.mockResolvedValue(updatedArea);

      const response = await request(app.getHttpServer())
        .patch(`/areas/${areaId}`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toEqual(updatedArea);
      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.update).toHaveBeenCalledWith(
        areaId,
        updateDto,
      );
    });

    it('should return 400 when name is not a string', async () => {
      const areaId = 1;
      const invalidDto = {
        name: 123,
      };

      const response = await request(app.getHttpServer())
        .patch(`/areas/${areaId}`)
        .send(invalidDto)
        .expect(400);

      expect(response.body.message).toContain('name must be a string');
      expect(mockAreasRepository.findById).not.toHaveBeenCalled();
    });

    it('should return 400 when soilTypeId is not a number', async () => {
      const areaId = 1;
      const invalidDto = {
        soilTypeId: 'invalid',
      };

      const response = await request(app.getHttpServer())
        .patch(`/areas/${areaId}`)
        .send(invalidDto)
        .expect(400);

      expect(response.body.message).toContain(
        'soilTypeId must be a number conforming to the specified constraints',
      );
      expect(mockAreasRepository.findById).not.toHaveBeenCalled();
    });

    it('should return 400 when irrigationTypeId is not a number', async () => {
      const areaId = 1;
      const invalidDto = {
        irrigationTypeId: 'invalid',
      };

      const response = await request(app.getHttpServer())
        .patch(`/areas/${areaId}`)
        .send(invalidDto)
        .expect(400);

      expect(response.body.message).toContain(
        'irrigationTypeId must be a number conforming to the specified constraints',
      );
      expect(mockAreasRepository.findById).not.toHaveBeenCalled();
    });

    it('should return 400 when isActive is not a boolean', async () => {
      const areaId = 1;
      const invalidDto = {
        isActive: 'true',
      };

      const response = await request(app.getHttpServer())
        .patch(`/areas/${areaId}`)
        .send(invalidDto)
        .expect(400);

      expect(response.body.message).toContain(
        'isActive must be a boolean value',
      );
      expect(mockAreasRepository.findById).not.toHaveBeenCalled();
    });

    it('should return 400 when id is not a number', async () => {
      const invalidId = 'invalid';
      const updateDto = {
        name: 'Test',
      };

      await request(app.getHttpServer())
        .patch(`/areas/${invalidId}`)
        .send(updateDto)
        .expect(400);

      expect(mockAreasRepository.findById).not.toHaveBeenCalled();
    });

    it('should accept empty body and not update anything', async () => {
      const areaId = 1;
      const emptyDto = {};
      const unchangedArea = {
        ...mockArea,
        updatedAt: '2023-01-02',
      };

      mockAreasRepository.findById.mockResolvedValue(mockArea);
      mockAreasRepository.update.mockResolvedValue(unchangedArea);

      const response = await request(app.getHttpServer())
        .patch(`/areas/${areaId}`)
        .send(emptyDto)
        .expect(200);

      expect(response.body).toEqual(unchangedArea);
      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.update).toHaveBeenCalledWith(areaId, emptyDto);
    });

    it('should update area with values 0 and false', async () => {
      const areaId = 1;
      const updateDto = {
        soilTypeId: 0,
        irrigationTypeId: 0,
        isActive: false,
      };
      const updatedArea = {
        ...mockArea,
        soilTypeId: 0,
        irrigationTypeId: 0,
        isActive: false,
        updatedAt: '2023-01-02',
      };

      mockAreasRepository.findById.mockResolvedValue(mockArea);
      mockAreasRepository.update.mockResolvedValue(updatedArea);

      const response = await request(app.getHttpServer())
        .patch(`/areas/${areaId}`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toEqual(updatedArea);
      expect(mockAreasRepository.findById).toHaveBeenCalledWith(areaId);
      expect(mockAreasRepository.update).toHaveBeenCalledWith(
        areaId,
        updateDto,
      );
    });
  });
});
