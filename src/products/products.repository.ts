import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async findById(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  /**
   * CRÍTICO 1: Renomeado para findByNameAndProducer.
   * Busca um produto pelo nome E producerId. O producerId pode ser 'null'
   * para buscar produtos globais, ou um ID para buscar produtos individuais.
   */
  async findByNameAndProducer(
    name: string,
    producerId: number | null, // Tipagem atualizada para aceitar null
  ): Promise<Product | null> {
    return this.prisma.product.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        producerId: producerId, // Usa o valor exato (ID ou null)
      },
    });
  }

  /**
   * CRÍTICO 2: Mantido (lógica correta).
   * Lista produtos de um produtor (produtos individuais + produtos globais).
   */
  async findByProducer(
    producerId: number,
  ): Promise<{ id: number; name: string }[]> {
    return this.prisma.product.findMany({
      where: {
        OR: [
          { producerId }, // Produtos individuais do produtor
          { producerId: null }, // Produtos globais
        ],
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async remove(id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
