import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VarietyRequestDto {
    @ApiProperty({ example: 'Variedade A', description: 'Nome da variedade' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 1, description: 'ID do produto associado' })
    @IsInt()
    @IsNotEmpty()
    productId: number;
}