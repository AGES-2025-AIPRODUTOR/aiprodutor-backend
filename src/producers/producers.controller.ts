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

@ApiTags('Producers') // Agrupa os endpoints no Swagger
@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) { }

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
  @ApiParam({ name: 'id', type: Number, description: 'ID da área' })
  @ApiBody({ type: UpdateProducerDto })
  @ApiResponse({ status: 200, description: 'Área atualizada com sucesso.', type: ProducerResponseDto })
  @ApiResponse({ status: 404, description: 'Área não encontrada.' })
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
}
