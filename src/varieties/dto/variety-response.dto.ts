import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VarietyResponseDto {
    @ApiProperty({ example: 1, description: 'ID único da variedade' })
    id: number;

    @ApiProperty({ example: 'Variedade A', description: 'Nome da variedade' })
    name: string;

    @ApiProperty({ example: 1, description: 'ID do produto associado' })
    productId: number;
}