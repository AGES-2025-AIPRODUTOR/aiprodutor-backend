import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepository) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name, producerId } = createProductDto;

    const existingProduct = await this.repository.findByName(name, producerId);

    if (existingProduct) {
      if (!producerId) {
        return existingProduct;
      }

      throw new ConflictException(
        `Este produtor já possui um produto com o nome "${name}".`,
      );
    }

    return this.repository.create(createProductDto);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.findOne(id);
    return this.repository.update(id, updateProductDto);
  }

  async findAll(): Promise<Product[]> {
    return this.repository.findAll();
  }

  async findByProducer(
    producerId: number,
  ): Promise<{ id: number; name: string }[]> {
    return this.repository.findByProducer(producerId);
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
    try {
      return await this.repository.remove(id);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        const constraint = error.meta?.field_name as string;

        let userMessage =
          'Não é possível remover o produto, pois ele está em uso.';

        if (constraint?.includes('productId')) {
          userMessage =
            'Não é possível remover o produto, pois ele está associado a um ou mais plantios.';
        }

        throw new ConflictException(userMessage);
      }
      throw error;
    }
  }
}

