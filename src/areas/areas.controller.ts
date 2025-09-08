import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AreasService } from './areas.service';
import { AreaRequestDto } from './dto/area-request.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { UpdateAreaStatusDto } from './dto/update-area-status.dto';

@ApiTags('Áreas')
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova área de plantio' })
  @ApiBody({ type: AreaRequestDto })
  @ApiResponse({ status: 201, description: 'Área criada com sucesso.' })
  @ApiResponse({
    status: 404,
    description: 'Recurso relacionado (produtor, etc.) não encontrado.',
  })
  @ApiResponse({ status: 400, description: 'Payload inválido.' })
  create(@Body() areaRequestDto: AreaRequestDto) {
    return this.areasService.create(areaRequestDto);
  }

  @Get('produtor/:producerId')
  @ApiOperation({ summary: 'Busca todas as áreas de um produtor específico' })
  @ApiParam({ name: 'producerId', type: Number, description: 'ID do produtor' })
  @ApiResponse({
    status: 200,
    description: 'Lista de áreas retornada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  findByProducer(@Param('producerId', ParseIntPipe) producerId: number) {
    return this.areasService.getAreasByProducerId(producerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma área específica pelo seu ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da área' })
  @ApiResponse({ status: 200, description: 'Área encontrada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Área não encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.areasService.getAreaById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edita uma área de plantio' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da área' })
  @ApiBody({ type: UpdateAreaDto })
  @ApiResponse({ status: 200, description: 'Área atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Área não encontrada.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAreaDto: UpdateAreaDto,
  ) {
    return this.areasService.update(id, updateAreaDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Ativa ou desativa uma área (soft delete)' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da área' })
  @ApiBody({ type: UpdateAreaStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Status da área atualizado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Área não encontrada.' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAreaStatusDto: UpdateAreaStatusDto,
  ) {
    return this.areasService.updateStatus(id, updateAreaStatusDto);
  }
}
