import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ProducersService } from './producers.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { FindDocumentoProducerDto } from './dto/findDocument-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { ProducerResponseDto } from './dto/producer-response.dto';
import { PlantingHistoryResponseDto } from './dto/planting-history-response.dto';
import { PlantingsService } from '../plantings/plantings.service';
import { HarvestsService } from '../harvests/harvests.service';
import { PlantedAreaMonthlyResponseDto } from './dto/planted-area-monthly-response.dto';

@ApiTags('Producers')
@Controller('producers')
export class ProducersController {
  constructor(
    private readonly producersService: ProducersService,
    private readonly plantingsService: PlantingsService,
    private readonly harvestsService: HarvestsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo produtor' })
  @ApiResponse({ status: 201, description: 'Produtor criado com sucesso.' })
  @ApiResponse({ status: 409, description: 'Documento ou e-mail já existem.' })
  create(@Body() createProducerDto: CreateProducerDto) {
    return this.producersService.create(createProducerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os produtores ou busca por cpf' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  @ApiResponse({ status: 400, description: 'Formato incorreto.' })
  findAllOrByDocument(
    @Query() findDocumentoProducerDto?: FindDocumentoProducerDto,
  ) {
    return this.producersService.findAllOrByDocument(
      findDocumentoProducerDto?.document,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um produtor pelo ID' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.producersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edita os dados de um produtor' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do produtor' })
  @ApiBody({ type: UpdateProducerDto })
  @ApiResponse({
    status: 200,
    description: 'Produtor atualizado com sucesso.',
    type: ProducerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProducerDto: Partial<UpdateProducerDto>,
  ) {
    return this.producersService.update(id, updateProducerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um produtor' })
  @ApiResponse({
    status: 200,
    description: 'Produtor removido com sucesso.',
    type: ProducerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.producersService.remove(id);
  }

  @Get(':id/plantings')
  @ApiOperation({ summary: 'Busca todos os plantios de um produtor' })
  @ApiResponse({
    status: 200,
    description: 'Lista de plantios retornada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  findAllPlantings(@Param('id', ParseIntPipe) id: number) {
    return this.plantingsService.findByProducerId(id);
  }

  @Get(':id/harvests')
  @ApiOperation({ summary: 'Busca todas as safras de um produtor' })
  @ApiResponse({
    status: 200,
    description: 'Lista de safras retornada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  findAllHarvestsByProducer(@Param('id', ParseIntPipe) id: number) {
    return this.harvestsService.findByProducerId(id);
  }

  @Get(':id/planting-history')
  @ApiOperation({ summary: 'Lista o histórico de plantios de um produtor' })
  @ApiParam({ name: 'id', description: 'ID do Produtor' })
  @ApiResponse({
    status: 200,
    description: 'Relatório de histórico de plantios retornado com sucesso.',
    type: [PlantingHistoryResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  getPlantingHistory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PlantingHistoryResponseDto[]> {
    return this.producersService.getPlantingHistory(id);
  }

  @Get(':id/reports/planted-area-monthly')
  @ApiExtraModels(PlantedAreaMonthlyResponseDto)
  @ApiOkResponse({
    description: 'Relatório mensal de área plantada (6 meses)',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(PlantedAreaMonthlyResponseDto) },
      example: [
        { mes: 'Junho', ano: 2024, areaPlantadaHa: 10.5 },
        { mes: 'Julho', ano: 2024, areaPlantadaHa: 12.3 },
        { mes: 'Agosto', ano: 2024, areaPlantadaHa: 8.9 },
        { mes: 'Setembro', ano: 2024, areaPlantadaHa: 9.7 },
        { mes: 'Outubro', ano: 2024, areaPlantadaHa: 11.0 },
        { mes: 'Novembro', ano: 2024, areaPlantadaHa: 7.6 },
      ],
    },
  })
  @ApiOperation({ summary: 'Lista a área plantada mensal de um produtor' })
  @ApiParam({ name: 'id', description: 'ID do Produtor' })
  @ApiResponse({
    status: 200,
    description: 'Relatório de área plantada mensal retornado com sucesso.',
    type: [PlantedAreaMonthlyResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  getPlantedAreaMonthly(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PlantedAreaMonthlyResponseDto[]> {
    return this.producersService.getPlantedAreaMonthlyReport(id);
  }
}