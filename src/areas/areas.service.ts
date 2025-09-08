import { Injectable, NotFoundException } from '@nestjs/common';
import { AreasRepository } from './areas.repository';
import { ProducersRepository } from '../producers/producers.repository';
import { SoilTypesRepository } from '../soil-types/soil-types.repository';
import { IrrigationTypesRepository } from '../irrigation-types/irrigation-types.repository';
import { AreaRequestDto } from './dto/area-request.dto';
import { UpdateAreaStatusDto } from './dto/update-area-status.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Injectable()
export class AreasService {
  constructor(
    private readonly repository: AreasRepository,
    private readonly producersRepository: ProducersRepository,
    private readonly soilTypesRepository: SoilTypesRepository,
    private readonly irrigationTypesRepository: IrrigationTypesRepository,
  ) {}

  async create(areaRequestDto: AreaRequestDto): Promise<any> {
    const { producerId, soilTypeId, irrigationTypeId } =
      areaRequestDto;
    // Verifica se o produtor existe
    const producer = await this.producersRepository.findById(producerId);
    if (!producer) {
      throw new NotFoundException('Produtor não encontrado');
    }
    // Verifica se o tipo de solo existe
    const soilType = await this.soilTypesRepository.findById(soilTypeId);
    if (!soilType) {
      throw new NotFoundException('Tipo de solo não encontrado');
    }
    // Verifica se o tipo de irrigação existe
    const irrigationType =
      await this.irrigationTypesRepository.findById(irrigationTypeId);
    if (!irrigationType) {
      throw new NotFoundException('Tipo de irrigação não encontrado');
    }

    return this.repository.create(areaRequestDto);
  }

  async updateStatus(id: number, dto: UpdateAreaStatusDto): Promise<any> {
    // Busca área
    const area = await this.repository.findById(id);
    if (!area) {
      throw new NotFoundException('Área não encontrada');
    }
    // status atual
    const ativoAtual = area.ativo === true;
    // idempotência: se já está no status desejado, retorna sem alterar
    if (ativoAtual === dto.ativo) {
      return area;
    }
    // Atualiza ativo
    return this.repository.updateStatus(id, dto.ativo);
  }

  async update(id: number, dto: UpdateAreaDto): Promise<any> {
    // 1. Verificar se a área existe
    const area = await this.repository.findById(id);
    if (!area) {
      throw new NotFoundException('Área não encontrada');
    }

    // 2. Atualiza a área no banco de dados usando o repositório
    return this.repository.update(id, dto);
  }
  
  async getAreaById(id: number) {
    const area = await this.repository.findById(id);
    if (!area) {
      throw new NotFoundException('Área não encontrada');
    }

    return {
      id: area.id,
      nome: area.nome,
      tipo_solo: area.soilType?.name,
      tipo_irrigacao: area.irrigationType?.name,
      ativo: area.ativo,
      criado_em: area.criado_em,
      poligono_geo: area.poligono_geo,
    };
  }

  async getAreasByProducerId(producerId: number) {
    const areas = await this.repository.findByProducerId(producerId);
    if (!areas || areas.length === 0) { // Uma verificação mais robusta
      // É melhor verificar a existência do produtor antes, mas por hora isso funciona.
      throw new NotFoundException('Produtor não encontrado ou não possui áreas');
    }

    return areas.map((area) => ({
      id: area.id,
      nome: area.nome,
      tipo_solo: area.soilType?.name,
      tipo_irrigacao: area.irrigationType?.name,
      ativo: area.ativo,
      criado_em: area.criado_em,
      poligono_geo: area.poligono_geo,
    }));
  }
}