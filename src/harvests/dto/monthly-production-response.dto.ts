import { ApiProperty } from '@nestjs/swagger';

export class MonthlyProductionResponseDto {
  @ApiProperty({
    description: 'Mês abreviado (3 letras)',
    example: 'Out',
  })
  mes: string;

  @ApiProperty({
    description: 'Ano',
    example: 2025,
  })
  ano: number;

  @ApiProperty({
    description: 'Produção estimada em quilogramas para o mês',
    example: 1600,
  })
  producaoEstimadaKg: number;
}
