import { ApiProperty } from '@nestjs/swagger';

export class Producer {
  @ApiProperty({ description: 'ID único do produtor', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Nome do produtor',
    example: 'Fazenda Sol Nascente',
  })
  name: string;

  @ApiProperty({
    description: 'Documento (CPF/CNPJ)',
    example: '12345678000199',
  })
  document: string;

  @ApiProperty({
    description: 'E-mail de contato',
    example: 'contato@fazendasol.com',
  })
  email: string;

  @ApiProperty({ description: 'Telefone de contato', example: '51999887766' })
  phone: string;

  @ApiProperty({ description: 'CEP', example: '90619900' })
  zipCode: string;

  @ApiProperty({ description: 'Cidade', example: 'Porto Alegre' })
  city: string;

  @ApiProperty({ description: 'Rua', example: 'Avenida Ipiranga' })
  street: string;

  @ApiProperty({ description: 'Número', example: '6681' })
  number: string;

  @ApiProperty({
    description: 'Complemento',
    example: 'Prédio 40',
    required: false,
  })
  complement?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  // O construtor facilita a criação de instâncias da entidade a partir de dados do Prisma.
  constructor(partial: Partial<Producer>) {
    Object.assign(this, partial);
  }

  /**
   * Exemplo de um método de negócio dentro da entidade.
   * Verifica se o perfil do produtor tem todos os campos de endereço preenchidos.
   */
  isAddressComplete(): boolean {
    return !!this.zipCode && !!this.city && !!this.street && !!this.number;
  }
}
