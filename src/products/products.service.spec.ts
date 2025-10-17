import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
// Adicionado BadRequestException
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common'; 
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client'; // Necessário para simular erro P2003

// CORRIGIDO: Tipagem do Produto alinhada com o schema (producerId: number | null)
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
    // CRÍTICO: Atualizado para o nome correto do método
    findByNameAndProducer: jest.fn(), 
    findByProducer: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    // findByName: jest.fn(), // Removido ou ignorado
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
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Testes para o método CREATE (Regras de Unicidade) ---
  describe('create', () => {
    const producerId = 10;
    const createDto: CreateProductDto = { name: 'Tomate Santa Cruz', producerId: producerId };
    const expectedProduct: Product = { id: 1, name: 'Tomate Santa Cruz', producerId: producerId, createdAt: new Date(), updatedAt: new Date() };

    // Cenário 1: Criação bem-sucedida (passa nas duas validações)
    it('should create a new product successfully (passes global and individual checks)', async () => {
      // 1. Não existe produto global com este nome
      repository.findByNameAndProducer.mockResolvedValueOnce(null);
      // 2. Não existe produto individual com este nome
      repository.findByNameAndProducer.mockResolvedValueOnce(null);
      repository.create.mockResolvedValue(expectedProduct);

      const result = await service.create(createDto);

      expect(result).toEqual(expectedProduct);
      expect(repository.findByNameAndProducer).toHaveBeenCalledTimes(2); 
    });

    // Cenário 2 (CRÍTICO - Conflito Global): Proibido usar nome de produto global
    it('should throw ConflictException if product name is already used by a GLOBAL product', async () => {
      const existingGlobalProduct: Product = { id: 99, producerId: null, name: 'Produto Global', createdAt: new Date(), updatedAt: new Date() };
      const dtoConflicting: CreateProductDto = { name: 'Produto Global', producerId: producerId };
      
      // Simula que a busca Global (producerId: null) encontra um produto
      repository.findByNameAndProducer.mockResolvedValue(existingGlobalProduct); 

      await expect(service.create(dtoConflicting)).rejects.toThrow(
        new ConflictException('O nome do produto "Produto Global" conflita com um produto global e não pode ser usado.')
      );
      expect(repository.findByNameAndProducer).toHaveBeenCalledTimes(1); 
      expect(repository.create).not.toHaveBeenCalled();
    });

    // Cenário 3 (Conflito Individual): Proibido dois produtos com mesmo nome do MESMO PRODUTOR
    it('should throw ConflictException if product name already exists FOR THE SAME PRODUCER (Individual)', async () => {
        
        // 1. Não existe produto global com este nome
        repository.findByNameAndProducer.mockResolvedValueOnce(null);
        // 2. Simula que a busca Individual encontra um produto
        repository.findByNameAndProducer.mockResolvedValueOnce(expectedProduct);

        await expect(service.create(createDto)).rejects.toThrow(
            new ConflictException('Este produtor já possui um produto com o nome "Tomate Santa Cruz".')
        );
        expect(repository.findByNameAndProducer).toHaveBeenCalledTimes(2); 
        expect(repository.create).not.toHaveBeenCalled();
    });
    
    // Cenário 4: Criação de produto global (se o DTO permitir)
    it('should create a GLOBAL product successfully if it does not conflict with existing global products', async () => {
        const createGlobalDto: CreateProductDto = { name: 'Produto Global' };
        const globalProduct: Product = { id: 2, name: 'Produto Global', producerId: null, createdAt: new Date(), updatedAt: new Date() };

        // 1. Não existe produto global com este nome
        repository.findByNameAndProducer.mockResolvedValueOnce(null); 
        repository.create.mockResolvedValue(globalProduct);
        
        const result = await service.create(createGlobalDto);
        
        expect(result).toEqual(globalProduct);
    });
  });

  // --- Testes para o método UPDATE (Proibição de Alteração de Nome) ---
  describe('update', () => {
    const existingProduct: Product = { id: 1, name: 'Tomate', producerId: 10, createdAt: new Date(), updatedAt: new Date() };
    
    // Mock padrão para findOne
    beforeEach(() => {
        repository.findById.mockResolvedValue(existingProduct);
    });
    
    // Cenário 1 (CRÍTICO - Regra 3): Proibição de alteração do nome
    it('should throw BadRequestException if the name is present in the UpdateProductDto', async () => {
        const updateDtoWithName: UpdateProductDto = { name: 'Novo Nome Proibido', producerId: 10 }; 
        
        await expect(service.update(1, updateDtoWithName)).rejects.toThrow(
            new BadRequestException('O nome do produto não pode ser alterado após a criação.')
        );
        // Não deve chamar o repository.update
        expect(repository.update).not.toHaveBeenCalled();
    });

    // Cenário 2: Atualização bem-sucedida (outros campos são alterados)
    it('should update a product successfully if only other fields are changed', async () => {
        const updateDto: UpdateProductDto = { producerId: 20 }; // Altera outro campo
        const updatedProduct: Product = { ...existingProduct, producerId: 20 };
        
        repository.update.mockResolvedValue(updatedProduct);
        
        const result = await service.update(1, updateDto);
        
        expect(result).toEqual(updatedProduct);
        expect(repository.findById).toHaveBeenCalledWith(1);
        expect(repository.update).toHaveBeenCalledWith(1, updateDto);
    });
    
    // Mantido o teste de NotFound
    it('should throw a NotFoundException if product to update is not found', async () => {
      const updateDto: UpdateProductDto = { producerId: 10 };
      repository.findById.mockResolvedValue(null);
      await expect(service.update(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // --- Testes para o método FINDBYPRODUCER (Verifica se retorna Global e Individual) ---
  describe('findByProducer', () => {
    it('should return products for a specific producer INCLUDING global products', async () => {
      const products: { id: number; name: string }[] = [
        { id: 1, name: 'Individual' },
        { id: 2, name: 'Global' },
      ];
      repository.findByProducer.mockResolvedValue(products);

      const result = await service.findByProducer(1);

      expect(result).toEqual(products);
      expect(repository.findByProducer).toHaveBeenCalledWith(1);
    });
  });
  
  // --- Testes para o método REMOVE ---
  describe('remove', () => {
    const existingProduct: Product = { id: 1, name: 'Tomate', producerId: 1, createdAt: new Date(), updatedAt: new Date() };

    it('should remove a product successfully', async () => {
        repository.findById.mockResolvedValue(existingProduct);
        repository.remove.mockResolvedValue(existingProduct);

        await service.remove(1);

        expect(repository.remove).toHaveBeenCalledWith(1);
    });

    it('should throw ConflictException if removal fails due to foreign key constraint (P2003)', async () => {
        repository.findById.mockResolvedValue(existingProduct);
        const fkError = new Prisma.PrismaClientKnownRequestError(
            'Foreign key constraint failed on the field: `productId`', 
            { code: 'P2003', clientVersion: '5.0.0', meta: { field_name: 'Planting_productId_fkey' } }
        );
        repository.remove.mockRejectedValue(fkError);

        await expect(service.remove(1)).rejects.toThrow(ConflictException);
    });
  });
});