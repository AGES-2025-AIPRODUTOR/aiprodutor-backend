import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class UpdateAreaDto {
  @ApiProperty({
    example: 'Novo Nome',
    description: 'Nome da área de plantio',
    required: false,
  })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({
    example: 1,
    description: 'ID do tipo de solo',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  tipo_solo?: number;

  @ApiProperty({
    example: 1,
    description: 'ID do tipo de irrigação',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  tipo_irrigacao?: number;

  @ApiProperty({
    example: true,
    description: 'Define se a área está ativa (true) ou inativa (false)',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
