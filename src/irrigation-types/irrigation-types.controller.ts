import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { IrrigationTypesDto } from './dto/irrigation-types.dto';
import { IrrigationTypesService } from './irrigation-types.service';
import { IrrigationTypes } from './entities/irrigation-types.entity';
import { UpdateIrrigationTypeDto } from './update-irrigation-type.dto';

@ApiTags('Tipos de Irrigação')
@Controller('irrigation-types')
export class IrrigationTypesController {
  constructor(
    private readonly irrigationTypesService: IrrigationTypesService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um novo tipo de irrigação' })
  @ApiBody({ type: IrrigationTypesDto })
  @ApiResponse({
    status: 201,
    description: 'Tipo de irrigação criado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Payload inválido.',
  })
  async create(
    @Body() irrigationTypesDto: IrrigationTypesDto,
  ): Promise<IrrigationTypes> {
    return await this.irrigationTypesService.create(irrigationTypesDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os tipos de irrigação' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
  async findAll(): Promise<IrrigationTypes[]> {
    return this.irrigationTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um tipo de irrigação pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Tipo de irrigação encontrado.' })
  @ApiResponse({
    status: 404,
    description: 'Tipo de irrigação não encontrado.',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IrrigationTypes> {
    return this.irrigationTypesService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um tipo de irrigação existente' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do tipo de irrigação' })
  @ApiBody({ type: UpdateIrrigationTypeDto })
  @ApiResponse({ status: 200, description: 'Tipo de irrigação atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Tipo de irrigação não encontrado.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIrrigationTypeDto: UpdateIrrigationTypeDto,
  ): Promise<IrrigationTypes> {
    return await this.irrigationTypesService.update(id, updateIrrigationTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um tipo de irrigação' })
  @ApiResponse({ status: 200, description: 'Tipo de irrigação removido com sucesso.'})
  @ApiResponse({ status: 404, description: 'Tipo de irrigação não encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.irrigationTypesService.remove(id);
  }
}
