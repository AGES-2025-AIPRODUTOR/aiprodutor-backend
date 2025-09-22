import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name, varieties } = createProductDto;

    return this.prisma.product.create({
      data: {
        name,
        varieties: varieties
          ? {
              create: varieties.map((varietyName) => ({ name: varietyName })),
            }
          : undefined,
      },
      include: {
        varieties: true,
      },
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { name, varieties } = updateProductDto;

    return this.prisma.product.update({
      where: { id },
      data: {
        name,
        varieties: varieties
          ? {
              create: varieties.map((varietyName) => ({ name: varietyName })),
            }
          : undefined,
      },
      include: {
        varieties: true,
      },
    });
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async findById(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { name } });
  }

  async remove(id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
