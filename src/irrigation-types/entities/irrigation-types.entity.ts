import { ApiProperty } from '@nestjs/swagger';

export class IrrigationTypes {
  @ApiProperty({ description: 'ID único do tipo de irrigação', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Nome do tipo de irrigação',
    example: 'Irrigação por gotejamento',
  })
  name: string;

  @ApiProperty({
    description: 'Descrição do tipo de irrigação',
    example: 'Descrição da irrigação por gotejamento',
  })
  description: string | null;
}
