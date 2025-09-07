import { ApiProperty } from '@nestjs/swagger';

export class SoilTypes {
  @ApiProperty({ description: 'ID único do tipo de solo', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Nome do tipo de solo',
    example: 'Solo argiloso',
  })
  name: string;

  @ApiProperty({
    description: 'Descrição do tipo de solo',
    example: 'Descrição do solo argiloso',
  })
  description: string | null;
}
