import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  Matches,
} from 'class-validator';

export class ProducerResponseDto {
  @ApiProperty({
    description: 'O nome completo ou razão social do produtor.',
    example: 'João da Silva',
  })
  name: string;

  @ApiProperty({
    description: 'O CPF ou CNPJ do produtor (apenas números).',
    example: '12345678901',
  })
  @Matches(/^(\d{11}|\d{14})$/, {
    message:
      'O campo document deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos) válido, somente números.',
  })
  document: string;

  @ApiProperty({
    description: 'Telefone de contato do produtor.',
    example: '51999998888',
  })
  phone: string;

  @ApiProperty({
    description: 'E-mail de contato do produtor.',
    example: 'joao.silva@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'CEP do endereço do produtor.',
    example: '90619900',
  })
  zipCode: string;

  @ApiProperty({
    description: 'Cidade do endereço do produtor.',
    example: 'Porto Alegre',
  })
  city: string;

  @ApiProperty({
    description: 'Rua do endereço do produtor.',
    example: 'Avenida Ipiranga',
  })
  street: string;

  @ApiProperty({
    description: 'Número do endereço do produtor.',
    example: '6681',
  })
  number: string;

  @ApiProperty({
    description: 'Complemento do endereço (opcional).',
    example: 'Prédio 40',
    required: false,
  })
  complement?: string;
}
