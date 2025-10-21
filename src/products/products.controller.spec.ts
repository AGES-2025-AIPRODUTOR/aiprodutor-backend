/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';

// Criamos um mock do serviço, simulando suas funções
const mockProductsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByProducer: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    // Configura o ambiente de teste do NestJS antes de cada teste
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService, // Quando o controller pedir pelo ProductsService...
          useValue: mockProductsService, // ... entregue nosso objeto mockado.
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  // Limpa os mocks depois de cada teste
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Testes para a rota POST /products ---
  describe('create', () => {
    it('should call the service create method and return the created product', async () => {
      const createDto: CreateProductDto = {
        name: 'Alface Americana',
        producerId: 1,
      };
      const expectedProduct = {
        id: 1,
        name: 'Alface Americana',
        producerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Product;

      // Configura o mock para retornar o produto esperado
      mockProductsService.create.mockResolvedValue(expectedProduct);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedProduct);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  // --- Testes para a rota GET /products ---
  describe('findAll', () => {
    it('should call the service findAll method and return an array of products', async () => {
      const products = [{ id: 1, name: 'Alface', producerId: 1 }] as Product[];
      mockProductsService.findAll.mockResolvedValue(products);

      const result = await controller.findAll();

      expect(result).toEqual(products);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  // --- Testes para a rota GET /products/producer/:producerId ---
  describe('findByProducer', () => {
    it('should call the service findByProducer method and return products from a specific producer', async () => {
      const products = [
        { id: 1, name: 'Tomate Santa Cruz', producerId: 1 },
        { id: 2, name: 'Alface Americana', producerId: 1 },
      ] as Product[];
      mockProductsService.findByProducer.mockResolvedValue(products);

      const result = await controller.findByProducer(1);

      expect(result).toEqual(products);
      expect(service.findByProducer).toHaveBeenCalledWith(1);
      expect(service.findByProducer).toHaveBeenCalledTimes(1);
    });
  });

  // --- Testes para a rota GET /products/:id ---
  describe('findOne', () => {
    it('should call the service findOne method and return a single product', async () => {
      const product = { id: 1, name: 'Alface', producerId: 1 } as Product;
      mockProductsService.findOne.mockResolvedValue(product);

      const result = await controller.findOne(1);

      expect(result).toEqual(product);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  // --- Testes para a rota PATCH /products/:id ---
  describe('update', () => {
    it('should call the service update method and return the updated product', async () => {
      const updateDto: UpdateProductDto = {
        name: 'Alface Crespa',
        producerId: 2,
      };
      const updatedProduct = {
        id: 1,
        name: 'Alface Crespa',
        producerId: 2,
      } as Product;
      mockProductsService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(updatedProduct);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  // --- Testes para a rota DELETE /products/:id ---
  describe('remove', () => {
    it('should call the service remove method and return the removed product', async () => {
      const removedProduct = {
        id: 1,
        name: 'Alface',
        producerId: 1,
      } as Product;
      mockProductsService.remove.mockResolvedValue(removedProduct);

      const result = await controller.remove(1);

      expect(result).toEqual(removedProduct);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
