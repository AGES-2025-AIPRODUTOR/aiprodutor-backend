import { ApiProperty } from '@nestjs/swagger';

export class Variety {
    @ApiProperty({ description: 'ID único da variedade', example: 1 })
    id: number;

    @ApiProperty({ description: 'ID do produto associado', example: 1 })
    productId: number;

    @ApiProperty({ description: 'Nome da variedade', example: 'Variedade A' })
    name: string;

    @ApiProperty({
        description: 'Data de criação',
        example: '2025-09-09T10:38:21Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Data de atualização',
        example: '2025-09-09T10:38:21Z',
    })
    updatedAt: Date;

    constructor(partial: Partial<Variety>) {
        Object.assign(this, partial);
    }
}