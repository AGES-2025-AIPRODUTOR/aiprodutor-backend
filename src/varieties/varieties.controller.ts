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
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { VarietiesService } from './varieties.service';
import { VarietyRequestDto } from './dto/variety-request.dto';
import { VarietyResponseDto } from './dto/variety-response.dto';
import { UpdatedVarietyDto } from './dto/update-variety.dto';

@ApiTags('Varieties')
@Controller('varieties')
export class VarietiesController {
    constructor(private readonly varietiesService: VarietiesService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Cria uma nova variedade' })
    @ApiBody({ type: VarietyRequestDto })
    @ApiResponse({ status: 201, description: 'Variedade criada com sucesso.', type: VarietyResponseDto })
    @ApiResponse({
        status: 404,
        description: 'Produto não encontrado.',
    })
    @ApiResponse({ status: 400, description: 'Payload inválido.' })
    create(@Body() varietyRequestDto: VarietyRequestDto) {
        return this.varietiesService.create(varietyRequestDto);
    }

    @Get('produto/:productId')
    @ApiOperation({ summary: 'Busca todas as variedades de um produto específico' })
    @ApiParam({ name: 'productId', type: Number, description: 'ID do produto' })
    @ApiResponse({
        status: 200,
        description: 'Lista de variedades retornada com sucesso.',
        type: [VarietyResponseDto],
    })
    @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
    findByProduct(@Param('productId', ParseIntPipe) productId: number) {
        return this.varietiesService.findByProductId(productId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca uma variedade específica pelo seu ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID da variedade' })
    @ApiResponse({ status: 200, description: 'Variedade encontrada com sucesso.', type: VarietyResponseDto })
    @ApiResponse({ status: 404, description: 'Variedade não encontrada.' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.varietiesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Edita uma variedade' })
    @ApiParam({ name: 'id', type: Number, description: 'ID da variedade' })
    @ApiBody({ type: UpdatedVarietyDto })
    @ApiResponse({ status: 200, description: 'Variedade atualizada com sucesso.', type: VarietyResponseDto })
    @ApiResponse({ status: 404, description: 'Variedade não encontrada.' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatedVarietyDto: UpdatedVarietyDto,
    ) {
        return this.varietiesService.update(id, updatedVarietyDto);
    }

    @Get()
    @ApiOperation({ summary: 'Busca todas as variedades cadastradas' })
    @ApiResponse({
        status: 200,
        description: 'Lista de todas as variedades retornada com sucesso.',
    })
    findAll() {
        return this.varietiesService.findAll();
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove uma variedade' })
    @ApiParam({ name: 'id', type: Number, description: 'ID da variedade' })
    @ApiResponse({ status: 200, description: 'Variedade removida com sucesso.', type: VarietyResponseDto })
    @ApiResponse({ status: 404, description: 'Variedade não encontrada.' })
    @ApiResponse({ status: 400, description: 'Não é possível remover a variedade, pois ela está em uso.' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.varietiesService.remove(id);
    }
}
