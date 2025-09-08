import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateProducerDto {
  @ApiProperty({
    description: 'O nome completo ou razão social do produtor.',
    example: 'João da Silva',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'O CPF ou CNPJ do produtor (apenas números).',
    example: '12345678901',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\d{11}|\d{14})$/, {
    message:
      'O campo document deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos) válido, somente números.',
  })
  document: string;

  @ApiProperty({
    description: 'Telefone de contato do produtor.',
    example: '51999998888',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'E-mail de contato do produtor.',
    example: 'joao.silva@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'CEP do endereço do produtor.',
    example: '90619900',
  })
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty({
    description: 'Cidade do endereço do produtor.',
    example: 'Porto Alegre',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'Rua do endereço do produtor.',
    example: 'Avenida Ipiranga',
  })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({
    description: 'Número do endereço do produtor.',
    example: '6681',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, { message: 'O campo number deve conter apenas dígitos.' })
  number: string;

  @ApiProperty({
    description: 'Complemento do endereço (opcional).',
    example: 'Prédio 40',
    required: false,
  })
  @IsString()
  @IsOptional()
  complement?: string;
}