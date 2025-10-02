import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { HarvestsService } from './harvests.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { HarvestResponseDto, InProgressHarvestDto } from './dto/harvest-response.dto';
import { HarvestPanelResponseDto } from './dto/harvest-panel.dto';
import { HarvestEntity } from './entities/harvest.entity';
import { GetHarvestHistoryQueryDto } from './dto/get-harvest-history-query.dto';
import { HarvestHistoryResponseDto } from './dto/harvest-history-response.dto';



@ApiTags('Harvests') 
@Controller('harvests') 
export class HarvestsController {
  constructor(private readonly harvestsService: HarvestsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova safra' })
  @ApiResponse({ status: 201, description: 'Safra criada com sucesso.', type: HarvestResponseDto })
  @ApiResponse({ status: 409, description: 'Já existe uma safra com este nome.' })
  create(@Body() createHarvestDto: CreateHarvestDto): Promise<HarvestEntity> {
    return this.harvestsService.create(createHarvestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as safras' })
  @ApiResponse({ status: 200, description: 'Lista de safras retornada com sucesso.', type: [HarvestResponseDto] })
  findAll(): Promise<HarvestEntity[]> {
    return this.harvestsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma safra pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da safra' })
  @ApiResponse({ status: 200, description: 'Safra encontrada.', type: HarvestResponseDto })
  @ApiResponse({ status: 404, description: 'Safra não encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<HarvestEntity> {
    return this.harvestsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma safra' })
  @ApiParam({ name: 'id', description: 'ID da safra' })
  @ApiResponse({ status: 200, description: 'Safra atualizada com sucesso.', type: HarvestResponseDto })
  @ApiResponse({ status: 404, description: 'Safra não encontrada.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateHarvestDto: UpdateHarvestDto): Promise<HarvestEntity> {
    return this.harvestsService.update(id, updateHarvestDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma safra' })
  @ApiParam({ name: 'id', description: 'ID da safra' })
  @ApiResponse({ status: 200, description: 'Safra removida com sucesso.', type: HarvestResponseDto })
  @ApiResponse({ status: 404, description: 'Safra não encontrada.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<HarvestEntity> {
    return this.harvestsService.remove(id);
  }

  @Get(':id/panel')
  @ApiOperation({ summary: 'Obtém o painel de controle de uma safra' })
  @ApiParam({ name: 'id', description: 'ID da safra' })
  @ApiResponse({ status: 200, description: 'Dados do painel retornados.', type: HarvestPanelResponseDto })
  @ApiResponse({ status: 404, description: 'Safra não encontrada.' })
  getHarvestPanel(@Param('id', ParseIntPipe) id: number): Promise<HarvestPanelResponseDto> {
    return this.harvestsService.getHarvestPanel(id);
  }

  @Get(':id/historico')
  @ApiOperation({ summary: 'Busca o histórico de safras de um produtor' })
  @ApiParam({ name: 'id', description: 'ID do Produtor para o qual o histórico será buscado' })
  @ApiResponse({ status: 200, description: 'Histórico de safras retornado com sucesso.', type: [HarvestHistoryResponseDto] })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  findHistory(
    @Param('id', ParseIntPipe) producerId: number,
    @Query() queryDto: GetHarvestHistoryQueryDto,
  ): Promise<HarvestHistoryResponseDto[]> {
    return this.harvestsService.findHistoryByProducer(producerId, queryDto);
  }

  
  @Get(':producerId/in-progress')
  @ApiOperation({ summary: 'Lista todas as safras em andamento de um produtor' })
  @ApiParam({ name: 'producerId', description: 'ID do produtor' })
  @ApiResponse({
      status: 200,
      description: 'Lista de safras em andamento retornada com sucesso.',
      type: HarvestEntity,
      isArray: true,
    })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  findInProgressByProducer(
    @Param('producerId', ParseIntPipe) producerId: number,
  ): Promise<HarvestEntity[]> {
    return this.harvestsService.findInProgressByProducer(producerId);
  }
}