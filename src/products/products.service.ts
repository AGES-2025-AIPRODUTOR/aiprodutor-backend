import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepository) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existingProduct = await this.repository.findByName(
      createProductDto.name,
    );
    if (existingProduct) {
      throw new ConflictException('Um produto com este nome já existe.');
    }
    // O DTO já contém as variedades, então basta passá-lo para o repositório
    return this.repository.create(createProductDto);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.findOne(id); // Garante que o produto existe
    // O DTO de atualização também contém as variedades, basta passá-lo
    return this.repository.update(id, updateProductDto);
  }

  async findAll(): Promise<Product[]> {
    return this.repository.findAll();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundException(`Produto com o ID ${id} não encontrado.`);
    }
    return product;
  }

  async remove(id: number): Promise<Product> {
    await this.findOne(id);
    return this.repository.remove(id);
  }
}
