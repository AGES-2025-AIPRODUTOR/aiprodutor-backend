import { ApiProperty } from '@nestjs/swagger';

export class ReportsCropsDistributionDto {
  @ApiProperty({
    example: 'Soja',
    description: 'Nome da cultura',
  })
  cropName: string;

  @ApiProperty({
    example: 35.5,
    description: 'Porcentagem da área em relação ao total (%)',
  })
  areaPercentage: number;
}
