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
  Delete,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PlantingsService } from './plantings.service';
import { CreatePlantingDto } from './dto/create-planting.dto';
import { PlantingResponseDto } from './dto/planting-response.dto';
import { UpdatePlantingDto } from './dto/update-planting.dto';

@ApiTags('Plantios')
@Controller('plantings')
export class PlantingsController {
  constructor(private readonly plantingsService: PlantingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um novo plantio' })
  @ApiBody({ type: CreatePlantingDto })
  @ApiResponse({
    status: 201,
    description: 'Plantio criado com sucesso.',
    type: PlantingResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Recurso relacionado (produto, área, etc.) não encontrado.',
  })
  @ApiResponse({ status: 400, description: 'Payload inválido.' })
  create(@Body() createPlantingDto: CreatePlantingDto) {
    return this.plantingsService.create(createPlantingDto);
  }

  @Get('produto/:productId')
  @ApiOperation({ summary: 'Busca todos os plantios de um produto específico' })
  @ApiParam({ name: 'productId', type: Number, description: 'ID do produto' })
  @ApiResponse({
    status: 200,
    description: 'Lista de plantios retornada com sucesso.',
    type: [PlantingResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.plantingsService.findByProductId(productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um plantio específico pelo seu ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do plantio' })
  @ApiResponse({
    status: 200,
    description: 'Plantio encontrada com sucesso.',
    type: PlantingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Plantio não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.plantingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edita um plantio' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do plantio' })
  @ApiBody({ type: UpdatePlantingDto })
  @ApiResponse({
    status: 200,
    description: 'Plantio atualizado com sucesso.',
    type: PlantingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Plantio não encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlantingDto: UpdatePlantingDto,
  ) {
    return this.plantingsService.update(id, updatePlantingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Busca todos os plantios cadastrados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos os plantios retornada com sucesso.',
  })
  findAll() {
    return this.plantingsService.findAll();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove um plantio' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID do plantio a ser removido',
  })
  @ApiResponse({ status: 204, description: 'Plantio removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Plantio não encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.plantingsService.remove(id);
  }
}
