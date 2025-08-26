import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateAreaStatusDto {
  @ApiProperty({ example: true, description: 'Define se a área está ativa (true) ou inativa (false)' })
  @IsBoolean()
  ativo: boolean;
}
