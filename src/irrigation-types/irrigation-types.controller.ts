import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
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
}
