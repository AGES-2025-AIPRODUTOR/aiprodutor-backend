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
import { AreaResponseDto } from './dto/area-response.dto';

// Interfaces para mocks
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
  areaSize: number;
  soilType: { id: number; name: string } | null;
  irrigationType: { id: number; name: string } | null;
}

// Mocks dos services e repositório
const mockAreasRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findByProducerId: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  updateStatus: jest.fn(),
};

const mockProducersService = { findOne: jest.fn() };
const mockSoilTypesService = { findById: jest.fn() };
const mockIrrigationTypesService = { findById: jest.fn() };

describe('AreasService', () => {
  let service: AreasService;

  // Dados de mock
  const mockAreaRequestDto: AreaRequestDto = {
    name: 'Área de Teste',
    producerId: 1,
    soilTypeId: 1,
    irrigationTypeId: 1,
    polygon: { type: 'Polygon', coordinates: [[[-51, -14], [-51, -15], [-52, -15], [-52, -14], [-51, -14]]]},
  };

  const mockAreaFromRepo: MockArea = {
    id: 1,
    name: 'Área de Teste',
    producerId: 1,
    soilTypeId: 1,
    irrigationTypeId: 1,
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    polygon: mockAreaRequestDto.polygon,
    areaSize: 12345.67,
    soilType: { id: 1, name: 'Tipo de Solo Teste' },
    irrigationType: { id: 1, name: 'Tipo de Irrigação Teste' },
  };
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AreasService,
        { provide: AreasRepository, useValue: mockAreasRepository },
        { provide: ProducersService, useValue: mockProducersService },
        { provide: SoilTypesService, useValue: mockSoilTypesService },
        { provide: IrrigationTypesService, useValue: mockIrrigationTypesService },
      ],
    }).compile();

    service = module.get<AreasService>(AreasService);
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

describe('create', () => {
  it('should create a new area successfully', async () => {
    // ARRANGE
    mockProducersService.findOne.mockResolvedValue({ id: 1 });
    mockSoilTypesService.findById.mockResolvedValue({ id: 1 });
    mockIrrigationTypesService.findById.mockResolvedValue({ id: 1 });
    mockAreasRepository.create.mockResolvedValue(mockAreaFromRepo);
      
    // ACT
    const result = await service.create(mockAreaRequestDto);

    // ASSERT
    expect(mockAreasRepository.create).toHaveBeenCalledWith(mockAreaRequestDto);
    
    // CORREÇÃO: REMOVA A LINHA ABAIXO, POIS O SERVICE NÃO CHAMA MAIS findById
    // expect(mockAreasRepository.findById).toHaveBeenCalledWith(createdAreaMinimal.id); 
    
    expect(result).toBeInstanceOf(AreaResponseDto);
    expect(result.id).toEqual(mockAreaFromRepo.id);
  });
  });

  describe('updateStatus', () => {
    it('should update area status successfully', async () => {
      const updatedArea = { ...mockAreaFromRepo, isActive: false };
      mockAreasRepository.findById.mockResolvedValue(mockAreaFromRepo);
      mockAreasRepository.updateStatus.mockResolvedValue(updatedArea);

      const result = await service.updateStatus(1, { isActive: false });
      expect(result.isActive).toBe(false);
    });
    
    it('should throw NotFoundException when area is not found', async () => {
      const areaId = 999;
      mockAreasRepository.findById.mockResolvedValue(null);

      // **CORREÇÃO DA MENSAGEM DE ERRO**
      await expect(service.updateStatus(areaId, { isActive: false })).rejects.toThrow(
        new NotFoundException(`Área com o ID ${areaId} não encontrada.`),
      );
    });
    
    it('should return existing area if status is already the desired one', async () => {
      mockAreasRepository.findById.mockResolvedValue(mockAreaFromRepo);
      
      const result = await service.updateStatus(1, { isActive: true }); // Status já é true
      
      expect(mockAreasRepository.updateStatus).not.toHaveBeenCalled();
      expect(result.id).toEqual(mockAreaFromRepo.id);
    });
  });

  describe('update', () => {
    it('should update area successfully', async () => {
      const updateDto: UpdateAreaDto = { name: 'Nome Atualizado' };
      const updatedArea = { ...mockAreaFromRepo, name: 'Nome Atualizado' };
      
      mockAreasRepository.findById.mockResolvedValue(mockAreaFromRepo);
      mockAreasRepository.update.mockResolvedValue(updatedArea);
      
      const result = await service.update(1, updateDto);
      
      expect(result.name).toBe('Nome Atualizado');
    });

  it('should throw NotFoundException when area to update is not found', async () => {
    const areaId = 999;
    const updateDto = { name: 'Teste' };
    
    // Arrange: Simula que o repositório não encontrou a área
    mockAreasRepository.findById.mockResolvedValue(null);

    // Act & Assert: Verifica se a chamada ao serviço é rejeitada com a exceção e mensagem corretas
    await expect(service.update(areaId, updateDto)).rejects.toThrow(
      new NotFoundException(`Área com o ID ${areaId} não encontrada.`),
    );

    // Opcional: Verifica se o método de update não foi chamado
    expect(mockAreasRepository.update).not.toHaveBeenCalled();
  });
  });

  describe('findOne', () => {
    it('should find one area successfully', async () => {
      mockAreasRepository.findById.mockResolvedValue(mockAreaFromRepo);
      const result = await service.findOne(1);
      expect(result.id).toBe(1);
    });

    it('should throw NotFoundException when area is not found', async () => {
      const areaId = 999;
      mockAreasRepository.findById.mockResolvedValue(null);

      // **CORREÇÃO DA MENSAGEM DE ERRO**
      await expect(service.findOne(areaId)).rejects.toThrow(
        new NotFoundException(`Área com o ID ${areaId} não encontrada.`),
      );
    });
  });
});