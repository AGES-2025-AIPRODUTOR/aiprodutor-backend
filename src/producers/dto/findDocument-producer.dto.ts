import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
    Matches,
    IsNumberString,
    IsOptional

} from 'class-validator';

export class FindDocumentoProducerDto {
@ApiPropertyOptional({
    description: 'O CPF ou CNPJ do produtor (somente números, sem formatação).',
    example: '12345678901',
  })
@IsNumberString({}, {
    message:  'document deve conter apenas números.'
  })
@IsOptional()
@Matches(/^(\d{11}|\d{14})$/, {
    message: 'document deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos) válido, somente números.',
  })
  document: string;
}

