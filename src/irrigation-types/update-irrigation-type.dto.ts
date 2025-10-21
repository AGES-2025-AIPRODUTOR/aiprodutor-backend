import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateIrrigationTypeDto {
  @ApiProperty({
    example: 'Gotejamento Avançado',
    description: 'Novo nome para o tipo de irrigação',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    example: 'Sistema de gotejamento com sensores de umidade.',
    description: 'Nova descrição para o tipo de irrigação',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
