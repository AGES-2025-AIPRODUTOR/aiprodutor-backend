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
import { SoilTypesDto } from './dto/soil-types.dto';
import { SoilTypesService } from './soil-types.service';
import { SoilTypes } from './entities/soil-types.entity';
import { UpdateSoilTypeDto } from './update-soil-type.dto';

@ApiTags('Tipos de Solo')
@Controller('soil-types')
export class SoilTypesController {
  constructor(private readonly soilTypesService: SoilTypesService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um novo tipo de solo' })
  @ApiBody({ type: SoilTypesDto })
  @ApiResponse({
    status: 201,
    description: 'Tipo de solo criado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Payload inválido.',
  })
  async create(@Body() soilTypesDto: SoilTypesDto): Promise<SoilTypes> {
    return await this.soilTypesService.create(soilTypesDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os tipos de solo' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
  async findAll(): Promise<SoilTypes[]> {
    return await this.soilTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um tipo de solo pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Tipo de solo encontrado.' })
  @ApiResponse({ status: 404, description: 'Tipo de solo não encontrado.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SoilTypes> {
    return await this.soilTypesService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um tipo de solo existente' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do tipo de solo' })
  @ApiBody({ type: UpdateSoilTypeDto })
  @ApiResponse({ status: 200, description: 'Tipo de solo atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Tipo de solo não encontrado.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSoilTypeDto: UpdateSoilTypeDto,
  ): Promise<SoilTypes> {
    return await this.soilTypesService.update(id, updateSoilTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um tipo de solo' })
  @ApiResponse({ status: 200, description: 'Tipo de solo removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Tipo de solo não encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.soilTypesService.remove(id);
  }
}
