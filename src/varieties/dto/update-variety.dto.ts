import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatedVarietyDto {
    @ApiProperty({ example: 'Variedade A', description: 'Nome da variedade' })
    @IsString()
    name: string;

    @ApiProperty({ example: 1, description: 'ID do produto associado' })
    @IsInt()
    productId: number;
}