import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Tomate Santa Cruz',
    description: 'Nome do produto agrícola',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID do produtor proprietário do produto (opcional)',
  })
  @IsNumber()
  @IsOptional()
  producerId?: number;
}
