import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlantingNestedDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @Type(() => Date) @IsDate() @IsNotEmpty() plantingDate: Date;
  @ApiProperty() @IsNumber() @IsNotEmpty() quantityPlanted: number;
  @ApiProperty() @IsInt() @IsNotEmpty() productId: number;
  @ApiProperty() @IsInt() @IsNotEmpty() varietyId: number;

  @ApiProperty({ example: [1, 2] })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  areaIds: number[];
}