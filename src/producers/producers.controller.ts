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
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProducersService } from './producers.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { FindDocumentoProducerDto } from './dto/findDocument-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { ProducerResponseDto } from './dto/producer-response.dto';
import { PlantingHistoryResponseDto } from './dto/planting-history-response.dto';
import { PlantingsService } from '../plantings/plantings.service';
import { HarvestsService } from '../harvests/harvests.service';

@ApiTags('Producers')
@Controller('producers')
export class ProducersController {
  constructor(
    private readonly producersService: ProducersService,
    private readonly plantingsService: PlantingsService, // Mantido da sua versão
    private readonly harvestsService: HarvestsService,   // Mantido da sua versão
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
  @ApiResponse({ status: 200, description: 'Produtor atualizado com sucesso.', type: ProducerResponseDto })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProducerDto: Partial<UpdateProducerDto>,
  ) {
    return this.producersService.update(id, updateProducerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um produtor' })
  @ApiResponse({ status: 200, description: 'Produtor removido com sucesso.', type: ProducerResponseDto })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.producersService.remove(id);
  }

  // Endpoint da sua versão (HEAD)
  @Get(':id/plantings')
  @ApiOperation({ summary: 'Busca todos os plantios de um produtor' })
  @ApiResponse({ status: 200, description: 'Lista de plantios retornada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  findAllPlantings(@Param('id', ParseIntPipe) id: number) {
    return this.plantingsService.findByProducerId(id);
  }

  // Endpoint da sua versão (HEAD)
  @Get(':id/harvests')
  @ApiOperation({ summary: 'Busca todas as safras de um produtor' })
  @ApiResponse({ status: 200, description: 'Lista de safras retornada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  findAllHarvestsByProducer(@Param('id', ParseIntPipe) id: number) {
    return this.harvestsService.findByProducerId(id);
  }

  // Endpoint da versão 'developer'
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
}
