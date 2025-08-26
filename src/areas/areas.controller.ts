import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AreasService } from './areas.service';
import { AreaRequestDto } from './dto/area-request.dto';

@ApiTags('Áreas')
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova área de plantio vinculada a um produtor' })
  @ApiBody({ type: AreaRequestDto })
  @ApiResponse({ status: 201, description: 'Área criada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor, tipo de solo ou tipo de irrigação não encontrado.' })
  @ApiResponse({ status: 400, description: 'Payload inválido ou polígono inválido.' })
  async create(@Body() areaRequestDto: AreaRequestDto) {
    return await this.areasService.create(areaRequestDto);
  }
}
