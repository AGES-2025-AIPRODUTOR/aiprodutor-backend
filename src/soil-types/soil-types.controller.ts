import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SoilTypesDto } from './dto/soil-types.dto';
import { SoilTypesService } from './soil-types.service';
import { SoilTypes } from './entities/soil-types.entity';

@ApiTags('Tipos de Solo')
@Controller('soil-types')
export class SoilTypesController {
  constructor(private readonly soilTypesService: SoilTypesService) {}

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
}
