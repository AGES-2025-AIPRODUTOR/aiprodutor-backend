import { ApiProperty } from '@nestjs/swagger';

export class ProductionByCropResponseDto {
  @ApiProperty({
    description: 'Nome da cultura',
    example: 'Milho',
  })
  cultura: string;

  @ApiProperty({
    description: 'Produção estimada total em quilogramas',
    example: 2000,
  })
  producaoEstimadaKg: number;
}
