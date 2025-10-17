import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException, // Adicionado para erros de regra de negócio no update
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepository) {}

  /**
   * CRÍTICO: Implementa validação de unicidade individual E conflito com produto global.
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name, producerId } = createProductDto;

    // 1. Validação CRÍTICA: Conflito com NOME GLOBAL
    const existingGlobalProduct = await this.repository.findByNameAndProducer(
      name,
      null, // Busca produtos globais (producerId: null)
    );

    if (existingGlobalProduct) {
      throw new ConflictException(
        `O nome do produto "${name}" conflita com um produto global e não pode ser usado.`,
      );
    }

    // 2. Validação CRÍTICA: Unicidade para o MESMO PRODUTOR
    if (producerId) {
      // Usando findByNameAndProducer (nome correto do método)
      const existingProduct = await this.repository.findByNameAndProducer(
        name,
        producerId,
      );

      if (existingProduct) {
        throw new ConflictException(
          `Este produtor já possui um produto com o nome "${name}".`,
        );
      }
    }

    // 3. Permite a criação (incluindo a criação de novos produtos globais, se producerId for omitido)
    return this.repository.create(createProductDto);
  }

  /**
   * CRÍTICO: Atualiza um produto, PROIBINDO a alteração do nome.
   */
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    // 1. NOVA REGRA: Proíbe a alteração do campo 'name'
    if (updateProductDto.name !== undefined) {
      throw new BadRequestException(
        'O nome do produto não pode ser alterado após a criação.',
      );
    }

    // 2. Busca o produto para garantir que ele exista antes de tentar atualizar
    await this.findOne(id);

    // 3. Se passou pela validação, atualiza os outros campos (producerId, etc.).
    return this.repository.update(id, updateProductDto);
  }

  // --- Outros métodos que permanecem inalterados na lógica de negócio: ---

  async findAll(): Promise<Product[]> {
    return this.repository.findAll();
  }

  async findByProducer(
    producerId: number,
  ): Promise<{ id: number; name: string }[]> {
    // A lógica de inclusão de produtos globais está no Repository.
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
