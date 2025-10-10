import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

type Product = {
  id: number;
  name: string;
  producerId: number | null;
  createdAt: Date;
  updatedAt: Date;
};

type MockRepository<T = any> = {
  [K in keyof T]: jest.Mock;
};

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: MockRepository;

  const mockRepository: MockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    findByProducer: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get(ProductsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Testes para o método CREATE ---
  describe('create', () => {
    it('should create a new product successfully', async () => {
      const createDto: CreateProductDto = {
        name: 'Tomate Santa Cruz',
        producerId: 1,
      };

      const expectedProduct: Product = {
        id: 1,
        name: 'Tomate Santa Cruz',
        producerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findByName.mockResolvedValue(null);
      repository.create.mockResolvedValue(expectedProduct);

      const result = await service.create(createDto);

      expect(result).toEqual(expectedProduct);
      expect(repository.findByName).toHaveBeenCalledWith('Tomate Santa Cruz');
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });

    it('should create a new product without producer successfully', async () => {
      const createDto: CreateProductDto = {
        name: 'Tomate Geral',
      };

      const expectedProduct: Product = {
        id: 2,
        name: 'Tomate Geral',
        producerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findByName.mockResolvedValue(null);
      repository.create.mockResolvedValue(expectedProduct);

      const result = await service.create(createDto);

      expect(result).toEqual(expectedProduct);
      expect(repository.findByName).toHaveBeenCalledWith('Tomate Geral');
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw a ConflictException if product name already exists', async () => {
      const createDto: CreateProductDto = { name: 'Tomate' };
      const existingProduct: Product = {
        id: 1,
        name: 'Tomate',
        producerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      repository.findByName.mockResolvedValue(existingProduct);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  // --- Testes para o método FINDALL ---
  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products: Product[] = [
        {
          id: 1,
          name: 'Tomate',
          producerId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      repository.findAll.mockResolvedValue(products);

      const result = await service.findAll();

      expect(result).toEqual(products);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  // --- Testes para o método FINDBYPRODUCER ---
  describe('findByProducer', () => {
    it('should return products for a specific producer', async () => {
      const products: Product[] = [
        {
          id: 1,
          name: 'Tomate Santa Cruz',
          producerId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Alface Americana',
          producerId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      repository.findByProducer.mockResolvedValue(products);

      const result = await service.findByProducer(1);

      expect(result).toEqual(products);
      expect(repository.findByProducer).toHaveBeenCalledWith(1);
    });
  });

  // --- Testes para o método FINDONE ---
  describe('findOne', () => {
    it('should return a single product by ID', async () => {
      const product: Product = {
        id: 1,
        name: 'Tomate',
        producerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      repository.findById.mockResolvedValue(product);

      const result = await service.findOne(1);

      expect(result).toEqual(product);
      expect(repository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if product is not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  // --- Testes para o método UPDATE ---
  describe('update', () => {
    it('should update a product successfully', async () => {
      const updateDto: UpdateProductDto = {
        name: 'Tomate Doce',
        producerId: 2,
      };
      const existingProduct: Product = {
        id: 1,
        name: 'Tomate',
        producerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updatedProduct: Product = {
        ...existingProduct,
        name: 'Tomate Doce',
        producerId: 2,
        updatedAt: new Date(),
      };

      repository.findById.mockResolvedValue(existingProduct);
      repository.update.mockResolvedValue(updatedProduct);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedProduct);
      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw a NotFoundException if product to update is not found', async () => {
      const updateDto: UpdateProductDto = { name: 'Inexistente' };
      repository.findById.mockResolvedValue(null);
      await expect(service.update(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // --- Testes para o método REMOVE ---
  describe('remove', () => {
    it('should remove a product successfully', async () => {
      const existingProduct: Product = {
        id: 1,
        name: 'Tomate',
        producerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      repository.findById.mockResolvedValue(existingProduct);
      repository.remove.mockResolvedValue(existingProduct);

      await service.remove(1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(repository.remove).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if product to remove is not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
