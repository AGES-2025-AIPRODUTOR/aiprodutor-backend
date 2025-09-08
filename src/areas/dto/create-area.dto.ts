import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateAreaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty()
  @IsInt()
  producerId: number;

  @ApiProperty()
  @IsInt()
  soilTypeId: number;

  @ApiProperty()
  @IsInt()
  irrigationTypeId: number;
}
