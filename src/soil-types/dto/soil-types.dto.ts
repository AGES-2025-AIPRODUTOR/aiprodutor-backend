import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SoilTypesDto {
  @ApiProperty({
    example: 'Solo argiloso',
    description: 'Nome do tipo de solo',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Descrição do solo argiloso',
    description: 'Descrição do tipo de solo',
  })
  @IsString()
  description: string | null;
}
