import { ApiProperty } from '@nestjs/swagger';

export class GeneralViewReportDto {
  @ApiProperty({
    example: 2000,
    description: "Área total em hectares (ha)",
  })
  totalAreaHectares: number;

  @ApiProperty({
    example: 3,
    description: "Número de culturas únicas plantadas",
  })
  uniqueProductsCount: number;

  @ApiProperty({
    example: 4123,
    description: "Produção esperada total em kg",
  })
  expectedYield: number;

  @ApiProperty({
    example: 4.5,
    description: "Eficiência média (produção esperada em kg por hectare)",
  })
  averageEfficiency: number;
}