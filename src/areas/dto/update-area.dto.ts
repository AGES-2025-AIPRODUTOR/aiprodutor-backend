import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateAreaDto {
  @ApiProperty({
    example: 'Novo Nome',
    description: 'Nome da área de plantio',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    example: 1,
    description: 'ID do tipo de solo',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  soilTypeId?: number;

  @ApiProperty({
    example: 1,
    description: 'ID do tipo de irrigação',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  irrigationTypeId?: number;

  @ApiProperty({
    example: true,
    description: 'Define se a área está ativa (true) ou inativa (false)',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
