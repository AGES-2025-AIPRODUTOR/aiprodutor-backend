import {
  Controller,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { AreasService } from './areas.service';
import { ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Áreas')
@Controller('api/v1')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get('areas/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Área encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Área não encontrada' })
  async findOne(@Param('id') id: string) {
    const area = await this.areasService.findById(+id);
    if (!area) throw new NotFoundException('Área não encontrada');
    return area;
  }

  @Get('produtores/:produtorId/areas')
  @ApiParam({ name: 'produtorId', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de áreas por produtor' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  async findByProducer(@Param('produtorId') produtorId: string) {
    const areas = await this.areasService.findByProducerId(+produtorId);
    if (areas === null) throw new NotFoundException('Produtor não encontrado');
    return areas;
  }
}
