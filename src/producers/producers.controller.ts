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
import { ProducersService } from './producers.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindDocumentoProducerDto } from './dto/findDocument-producer.dto';
import { find } from 'rxjs';

@ApiTags('Producers') // Agrupa os endpoints no Swagger
@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo produtor' })
  @ApiResponse({ status: 201, description: 'Produtor criado com sucesso.' })
  @ApiResponse({ status: 409, description: 'Documento ou e-mail já existem.' })
  create(@Body() createProducerDto: CreateProducerDto) {
    return this.producersService.create(createProducerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os produtores ou busca por cpf'})
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.'})
  @ApiResponse({ status: 400, description: 'Formato incorreto.'})
  @ApiQuery({ name: 'cpf_cnpj', required: false, type: String, description: 'CPF ou CNPJ do produtor (opcional)'})
  findAllOrByDocument(@Query() findDocumentoProducerDto?: FindDocumentoProducerDto) {
    return this.producersService.findAllOrByDocument(findDocumentoProducerDto?.document);
  }
  

  @Get(':id')
  @ApiOperation({ summary: 'Busca um produtor pelo ID' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.producersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um produtor' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProducerDto: Partial<CreateProducerDto>,
  ) {
    return this.producersService.update(id, updateProducerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um produtor' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.producersService.remove(id);
  }
}
