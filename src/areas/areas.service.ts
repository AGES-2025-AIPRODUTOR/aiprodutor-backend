import { Injectable, NotFoundException } from "@nestjs/common";
import { AreasRepository } from "./areas.repository";

@Injectable()
export class AreasService {
  constructor(private readonly repository: AreasRepository) {}

  async getAreaById(id: number) {
    const area = await this.repository.findById(id);
    if (!area) {
      throw new NotFoundException("Área não encontrada");
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
    if (!areas) {
      throw new NotFoundException("Produtor não encontrado");
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
