import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
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

@ApiTags('Tipos de Irrigação')
@Controller('irrigation-types')
export class IrrigationTypesController {
  constructor(
    private readonly irrigationTypesService: IrrigationTypesService,
  ) {}

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
}
