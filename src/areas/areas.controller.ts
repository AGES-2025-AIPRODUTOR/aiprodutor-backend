import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Patch,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { AreasService } from './areas.service';
import { AreaRequestDto } from './dto/area-request.dto';
import { UpdateAreaStatusDto } from './dto/update-area-status.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@ApiTags('Áreas')
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cria uma nova área de plantio vinculada a um produtor',
  })
  @ApiBody({ type: AreaRequestDto })
  @ApiResponse({ status: 201, description: 'Área criada com sucesso.' })
  @ApiResponse({
    status: 404,
    description: 'Produtor, tipo de solo ou tipo de irrigação não encontrado.',
  })
  @ApiResponse({
    status: 400,
    description: 'Payload inválido ou polígono inválido.',
  })
  async create(@Body() areaRequestDto: AreaRequestDto) {
    return await this.areasService.create(areaRequestDto);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Excluir/Desativar uma área (soft delete)' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da área' })
  @ApiBody({ type: UpdateAreaStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Status da área atualizado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Área não encontrada.' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAreaStatusDto: UpdateAreaStatusDto,
  ) {
    return await this.areasService.updateStatus(id, updateAreaStatusDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Edita uma área de plantio' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da área' })
  @ApiBody({ type: UpdateAreaDto })
  @ApiResponse({ status: 200, description: 'Área atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Área não encontrada.' })
  @ApiResponse({ status: 422, description: 'Payload inválido.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAreaDto: UpdateAreaDto,
  ) {
    try {
      return await this.areasService.update(id, updateAreaDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
