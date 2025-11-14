import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
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

    // 1. Validação CRÍTICA: Conflito com NOME GLOBAL (Individual não pode usar nome Global)
    if (producerId) {
        const existingGlobalProduct = await this.repository.findByNameAndProducer(name, null);

        if (existingGlobalProduct) {
            throw new ConflictException(
                `O nome "${name}" conflita com um produto global e não pode ser usado por um produtor individual.`,
            );
        }
    }

    // 2. Validação CRÍTICA: Unicidade Individual/Global (Evita duplicidade no mesmo scope)
    const existingProduct = await this.repository.findByNameAndProducer(
        name,
        producerId ?? null,
    );

    if (existingProduct) {
        // Lança 409, evitando o Erro 500 do banco de dados (Constraint Error)
        const msg = producerId 
            ? `Este produtor já possui um produto com o nome "${name}".`
            : `O produto global com o nome "${name}" já existe.`;
        throw new ConflictException(msg);
    }
    
    return this.repository.create(createProductDto);
  }

  /**
   * CRÍTICO: Removida a proibição de edição de nome e adicionada a validação completa.
   */
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    
    // 1. Busca o produto existente (para validar NotFound)
    const existingProduct = await this.findOne(id); 
    
    // Determina o estado resultante após a edição
    const newName = updateProductDto.name ?? existingProduct.name;
    // O producerId pode ser explicitamente null no DTO para transformá-lo em Global
    const newProducerId = updateProductDto.producerId === null 
        ? null 
        : (updateProductDto.producerId ?? existingProduct.producerId);

    // --- VALIDAÇÃO DE CONFLITO ---

    // A. Conflito P_Ind vs P_Glob:
    // SÓ valida se o PRODUTO RESULTANTE (newProducerId) é um produto individual.
    if (newProducerId !== null) { 
        const existingGlobalProduct = await this.repository.findByNameAndProducer(newName, null);
        
        // Se um produto global com o novo nome existe, e o produto RESULTANTE será individual, é um conflito.
        if (existingGlobalProduct) {
            throw new ConflictException(
                `O nome "${newName}" conflita com um produto global e não pode ser usado por um produtor individual.`,
            );
        }
    }

    // B. Conflito P_Ind vs P_Ind ou P_Glob vs P_Glob
    // Verifica se a nova combinação (newName, newProducerId) já existe para outro produto.
    const conflictingProduct = await this.repository.findByNameAndProducer(
        newName,
        newProducerId,
    );
    
    // Se o produto encontrado (conflictingProduct) existe E não é o produto que estamos atualizando.
    if (conflictingProduct && conflictingProduct.id !== id) {
        const msg = newProducerId
            ? `Este produtor já possui um produto com o nome "${newName}".`
            : `O produto global com o nome "${newName}" já existe.`;
        throw new ConflictException(msg);
    }
    
    // 3. Se passou pelas validações, atualiza
    return this.repository.update(id, updateProductDto);
  }

  // ... (findAll, findByProducer, findOne e remove permanecem inalterados)
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