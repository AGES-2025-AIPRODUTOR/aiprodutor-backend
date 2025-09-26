import { ApiProperty } from '@nestjs/swagger';
import { Product as PrismaProduct } from '@prisma/client';

export class Product implements PrismaProduct {
  @ApiProperty({ description: 'ID único do produto', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Nome do produto agrícola',
    example: 'Tomate Italiano',
  })
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}
