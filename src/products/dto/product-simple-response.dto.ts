import { ApiProperty } from '@nestjs/swagger';

export class ProductSimpleResponseDto {
  @ApiProperty({ description: 'ID do produto', example: 1 })
  id: number;

  @ApiProperty({ description: 'Nome do produto', example: 'Tomate Santa Cruz' })
  name: string;
}
