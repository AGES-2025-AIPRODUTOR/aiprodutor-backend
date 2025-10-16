import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class IrrigationTypesDto {
  @ApiProperty({
    example: 'Irrigação por gotejamento',
    description: 'Nome do tipo de irrigação',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Descrição da irrigação por gotejamento',
    description: 'Descrição do tipo de irrigação',
  })
  @IsString()
  description: string | null;
}
