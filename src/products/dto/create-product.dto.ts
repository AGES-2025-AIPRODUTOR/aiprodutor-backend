import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Tomate',
    description: 'Nome do produto agrícola',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: ['Italiano', 'Cereja', 'Débora'],
    description:
      'Uma lista com os nomes das variedades iniciais para este produto (opcional)',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true }) // Valida que cada item do array é uma string
  @IsOptional()
  varieties?: string[];
}
