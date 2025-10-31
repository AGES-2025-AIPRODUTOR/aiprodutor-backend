import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common'; 
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client'; 

type Product = { id: number; name: string; producerId: number | null; createdAt: Date; updatedAt: Date; };
type MockRepository<T = any> = { [K in keyof T]: jest.Mock; };

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: MockRepository;

  const mockRepository: MockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByNameAndProducer: jest.fn(),
    findByProducer: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: ProductsRepository, useValue: mockRepository, },
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
    const createIndividualDto: CreateProductDto = { name: 'Tomate Santa Cruz', producerId: producerId };
    const createGlobalDto: CreateProductDto = { name: 'Tomate Santa Cruz' };
    const expectedIndividualProduct: Product = { id: 1, producerId: producerId, name: 'Tomate Santa Cruz', createdAt: new Date(), updatedAt: new Date() };
    const existingGlobalProduct: Product = { id: 99, producerId: null, name: 'Tomate Santa Cruz', createdAt: new Date(), updatedAt: new Date() };

    // Cenário 1: Criação bem-sucedida
    it('should create a new product successfully (passes global and individual checks)', async () => {
      // 1. Mock para a primeira checagem (Global Check): PASS
      repository.findByNameAndProducer.mockResolvedValueOnce(null);
      // 2. Mock para a segunda checagem (Individual Check): PASS
      repository.findByNameAndProducer.mockResolvedValueOnce(null);
      repository.create.mockResolvedValue(expectedIndividualProduct);

      await expect(service.create(createIndividualDto)).resolves.toBeDefined();
    });

    // Cenário 2 (Conflito Global): Proibido usar nome de produto global
    it('should throw ConflictException if an INDIVIDUAL product uses a GLOBAL name', async () => {
      repository.findByNameAndProducer.mockResolvedValue(existingGlobalProduct); 

      await expect(service.create(createIndividualDto)).rejects.toThrow(
        new ConflictException('O nome "Tomate Santa Cruz" conflita com um produto global e não pode ser usado por um produtor individual.')
      );
    });

    // Cenário 3 (CORRIGIDO): Duplicidade Individual
    it('should throw ConflictException if a DUPLICATE INDIVIDUAL product is created', async () => {
        
        // 1. Mock para a primeira checagem (Global Check): PASS
        repository.findByNameAndProducer.mockResolvedValueOnce(null);
        // 2. Mock para a segunda checagem (Individual Check): FAIL (Retorna o produto duplicado)
        repository.findByNameAndProducer.mockResolvedValueOnce(expectedIndividualProduct);

        await expect(service.create(createIndividualDto)).rejects.toThrow(
            new ConflictException('Este produtor já possui um produto com o nome "Tomate Santa Cruz".')
        );
        expect(repository.create).not.toHaveBeenCalled();
    });

    // Cenário 4: Criação de produto global com sucesso
    it('should create a GLOBAL product even if an INDIVIDUAL product with the same name exists', async () => {
        // Mock para a checagem P_Glob vs P_Glob: PASS
        repository.findByNameAndProducer.mockResolvedValueOnce(null); 
        repository.create.mockResolvedValue({ id: 3, ...createGlobalDto, producerId: null, createdAt: new Date(), updatedAt: new Date() });

        await expect(service.create(createGlobalDto)).resolves.toBeDefined();
    });

    // Cenário 5: DUPLICIDADE GLOBAL
    it('should throw ConflictException if a DUPLICATE GLOBAL product is created', async () => {
        // Mock para a checagem P_Glob vs P_Glob: FAIL
        repository.findByNameAndProducer.mockResolvedValueOnce(existingGlobalProduct);
        
        await expect(service.create(createGlobalDto)).rejects.toThrow(
            new ConflictException('O produto global com o nome "Tomate Santa Cruz" já existe.')
        );
    });
  });

  // --- Testes para o método UPDATE (Nova Lógica de Edição) ---
  describe('update', () => {
    const existingProduct: Product = { id: 1, name: 'Produto Original', producerId: 10, createdAt: new Date(), updatedAt: new Date() };
    const globalProduct: Product = { id: 99, name: 'Nome Global', producerId: null, createdAt: new Date(), updatedAt: new Date() };
    const duplicateProduct: Product = { id: 2, name: 'Produto Duplicado', producerId: 10, createdAt: new Date(), updatedAt: new Date() };

    beforeEach(() => {
        repository.findById.mockResolvedValue(existingProduct); 
    });
    
    // Cenário 1 (CORRIGIDO): Atualização bem-sucedida (passa por todas as validações sem conflito)
    it('should update successfully when fields are changed and no conflict exists', async () => {
        const updateDto: UpdateProductDto = { name: 'Novo Nome Único', producerId: 20 }; 
        const updatedProduct: Product = { ...existingProduct, name: 'Novo Nome Único', producerId: 20 };
        
        // MOCK SEQUENCIAL para garantir o sucesso:
        // 1. Checagem P_Ind vs P_Glob (PASS)
        repository.findByNameAndProducer.mockResolvedValueOnce(null); 
        // 2. Checagem P_Ind vs P_Ind (PASS)
        repository.findByNameAndProducer.mockResolvedValueOnce(null); 
        
        repository.update.mockResolvedValue(updatedProduct);
        
        await expect(service.update(1, updateDto)).resolves.toEqual(updatedProduct);
        expect(repository.update).toHaveBeenCalledWith(1, updateDto);
    });
    
    // Cenário 2 (BUG REPORTADO): Tentativa de duplicar produto do MESMO PRODUTOR
    it('should throw ConflictException (409) when attempting to duplicate name for the SAME producer', async () => {
        const updateDto: UpdateProductDto = { name: 'Produto Duplicado' }; 
        
        // 1. Checagem P_Ind vs P_Glob (PASS)
        repository.findByNameAndProducer.mockResolvedValueOnce(null); 
        // 2. Checagem P_Ind vs P_Ind (FAIL)
        repository.findByNameAndProducer.mockResolvedValueOnce(duplicateProduct); 

        await expect(service.update(1, updateDto)).rejects.toThrow(
            new ConflictException('Este produtor já possui um produto com o nome "Produto Duplicado".')
        );
        expect(repository.update).not.toHaveBeenCalled();
    });

    // Cenário 3 (BUG REPORTADO): Tentativa de fazer um produto GLOBAL duplicado (via edit)
    it('should throw ConflictException (409) when attempting to create a DUPLICATE GLOBAL product (via edit)', async () => {
        const updateDto: UpdateProductDto = { name: 'Nome Global', producerId: null };
        
        // Checagem P_Glob vs P_Glob (FAIL)
        repository.findByNameAndProducer.mockResolvedValueOnce(globalProduct); 

        await expect(service.update(1, updateDto)).rejects.toThrow(
            new ConflictException('O produto global com o nome "Nome Global" já existe.')
        );
        expect(repository.update).not.toHaveBeenCalled();
    });

    // Cenário 4: INDIVIDUAL tenta usar nome GLOBAL (via edição)
    it('should throw ConflictException (409) if an INDIVIDUAL product is edited to use a GLOBAL name', async () => {
        const updateDto: UpdateProductDto = { name: 'Nome Global' }; 

        // Checagem P_Ind vs P_Glob (FAIL)
        repository.findByNameAndProducer.mockResolvedValueOnce(globalProduct); 
        
        await expect(service.update(1, updateDto)).rejects.toThrow(
            new ConflictException('O nome "Nome Global" conflita com um produto global e não pode ser usado por um produtor individual.')
        );
        expect(repository.update).not.toHaveBeenCalled();
    });

    // Cenário 5: Edição para se tornar GLOBAL com sucesso
    it('should successfully update product to become GLOBAL if name is unique', async () => {
        const updateDto: UpdateProductDto = { producerId: null, name: 'Novo Global Único' }; 
        const updatedProduct: Product = { ...existingProduct, name: 'Novo Global Único', producerId: null };
        
        // 1. Checagem P_Glob vs P_Glob (PASS)
        repository.findByNameAndProducer.mockResolvedValueOnce(null); 
        repository.update.mockResolvedValue(updatedProduct);
        
        await expect(service.update(1, updateDto)).resolves.toEqual(updatedProduct);
    });
    
    // Cenário 6: Produto não encontrado
    it('should throw a NotFoundException if product to update is not found', async () => {
      const updateDto: UpdateProductDto = { producerId: 10 };
      repository.findById.mockResolvedValue(null);
      await expect(service.update(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});