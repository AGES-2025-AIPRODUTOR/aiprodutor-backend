import { ApiProperty } from '@nestjs/swagger';

export class PlantedAreaMonthlyResponseDto {
    @ApiProperty({ example: 'Janeiro', description: 'Mês do relatório' })
    mes: string;

    @ApiProperty({ example: 2023, description: 'Ano do relatório' })
    ano: number;

    @ApiProperty({ example: 10.5, description: 'Área plantada (hectares)' })
    areaPlantadaHa: number;
}


