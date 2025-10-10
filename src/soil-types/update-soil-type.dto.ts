import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateSoilTypeDto {
  @ApiProperty({
    example: 'Solo Argiloso Fértil',
    description: 'Novo nome para o tipo de solo',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    example: 'Solo rico em argila, bom para retenção de água.',
    description: 'Nova descrição para o tipo de solo',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
