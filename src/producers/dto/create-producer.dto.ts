import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Length,
  IsInt,
  Min,
  IsNumberString,
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
    description: 'O CPF ou CNPJ do produtor (somente números, sem formatação).',
    example: '12345678901',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\d{11}|\d{14})$/, {
    message: 'document deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos) válido, somente números.',
  })
  document: string;

  @ApiProperty({
    description: 'Telefone de contato do produtor (somente números).',
    example: '51999998888',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10,11}$/, {
    message: 'phone deve conter 10 ou 11 dígitos, somente números.',
  })
  phone: string;

  @ApiProperty({
    description: 'E-mail de contato do produtor.',
    example: 'joao.silva@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'CEP do endereço do produtor (8 dígitos, somente números).',
    example: '90619900',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{8}$/, {
    message: 'zipCode deve conter exatamente 8 dígitos, somente números.',
  })
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
  @Matches(/^\d+$/, { message: 'number deve conter apenas dígitos.' })
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
