import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { ProductSimpleResponseDto } from './dto/product-simple-response.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo produto' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso.',
    type: Product,
  })
  @ApiResponse({
    status: 409,
    description: 'Um produto com este nome já existe.',
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os produtos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso.',
    type: [Product],
  })
  findAll() {
    return this.productsService.findAll();
  }

  @Get('producer/:producerId')
  @ApiOperation({
    summary: 'Lista produtos de um produtor (globais e customizados)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos (id e nome) retornada com sucesso.',
    type: [ProductSimpleResponseDto],
  })
  findByProducer(@Param('producerId', ParseIntPipe) producerId: number) {
    return this.productsService.findByProducer(producerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um produto pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Produto encontrado com sucesso.',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um produto' })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado com sucesso.',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um produto' })
  @ApiResponse({
    status: 200,
    description: 'Produto removido com sucesso.',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  @ApiResponse({
    status: 409,
    description: 'Conflito: o produto está em uso e não pode ser removido.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
