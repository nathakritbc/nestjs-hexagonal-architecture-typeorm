# AI Agent Specification - NestJS Hexagonal Architecture Project

## Project Overview

This is a **NestJS application** implementing **Hexagonal Architecture (Ports and Adapters)** with **TypeORM** as the primary ORM. The project demonstrates clean architecture principles with clear separation of concerns between business logic, infrastructure, and presentation layers.

### Key Technologies & Dependencies
- **Framework**: NestJS v11
- **Database ORM**: TypeORM v0.3.25 
- **Database**: PostgreSQL (via pg driver)
- **Authentication**: JWT with Passport.js & Argon2 for hashing
- **Documentation**: Swagger/OpenAPI
- **Testing**: Vitest with coverage
- **Logging**: Pino with nestjs-pino
- **Validation**: class-validator & class-transformer
- **Linting**: OXLint
- **Package Manager**: PNPM (preferred)
- **Transaction Management**: @nestjs-cls/transactional with TypeORM adapter

## Architecture Patterns

### Hexagonal Architecture Structure
Each domain module follows this consistent structure:

```
src/{module-name}/
├── adapters/
│   ├── inbounds/           # Controllers, DTOs, HTTP adapters
│   │   ├── {entity}.controller.ts
│   │   ├── {operation}.dto.ts
│   │   └── {entity}.http (HTTP files)
│   └── outbounds/          # Database entities, repository implementations
│       ├── {entity}.entity.ts
│       └── {entity}.typeorm.repository.ts
├── applications/
│   ├── domains/            # Domain models and business logic
│   │   ├── {entity}.domain.ts
│   │   └── {entity}.domain.spec.ts
│   ├── ports/              # Repository interfaces (contracts)
│   │   └── {entity}.repository.ts
│   └── usecases/           # Business use cases
│       ├── {operation}.usecase.ts
│       └── {operation}.usecase.spec.ts
└── {module}.module.ts      # Module definition
```

### Existing Modules
1. **Users Module** - User management with authentication
2. **Products Module** - Product catalog management  
3. **Auth Module** - Authentication and authorization
4. **Database Module** - Database configuration and connections

## AI Agent Guidelines

### Code Generation Principles
1. **Follow Hexagonal Architecture**: Always maintain the clear separation between adapters, applications, and domains
2. **Use TypeScript**: Leverage strong typing throughout the application
3. **Apply SOLID Principles**: Ensure single responsibility, dependency inversion, etc.
4. **Test-Driven Approach**: Generate corresponding test files (.spec.ts) for all business logic
5. **Use Dependency Injection**: Leverage NestJS DI container properly

### Module Creation Workflow
When creating new modules, follow this sequence:

#### 1. Domain Layer (Core Business Logic)
- Create domain entity with business rules
- Write domain tests
- Define repository port (interface)

#### 2. Application Layer (Use Cases)
- Implement use cases that orchestrate domain operations
- Write use case tests
- Ensure use cases depend only on ports, not concrete implementations

#### 3. Adapter Layer (Infrastructure & Presentation)
- **Outbound Adapters**: Create TypeORM entities and repository implementations
- **Inbound Adapters**: Create controllers, DTOs, and API endpoints
- Generate Swagger documentation

#### 4. Module Registration
- Create NestJS module with proper provider binding
- Register in AppModule
- Configure any necessary middleware or guards

### Code Conventions

#### File Naming
- **Domains**: `{entity}.domain.ts`
- **Use Cases**: `{operation}{Entity}.usecase.ts`
- **Controllers**: `{entity}.controller.ts`
- **DTOs**: `{operation}{Entity}.dto.ts`
- **Entities**: `{entity}.entity.ts`
- **Repositories**: `{entity}.typeorm.repository.ts`
- **Repository Ports**: `{entity}.repository.ts`
- **Tests**: `{filename}.spec.ts`

#### Class Naming
- **Domains**: `{Entity}Domain`
- **Use Cases**: `{Operation}{Entity}UseCase`
- **Controllers**: `{Entity}Controller`
- **DTOs**: `{Operation}{Entity}Dto`
- **Entities**: `{Entity}Entity`
- **Repositories**: `{Entity}TypeormRepository`
- **Repository Ports**: `{Entity}Repository`

#### Import Organization
Use the prettier-plugin-organize-imports to automatically organize imports:
1. Node.js built-in modules
2. External libraries
3. Internal modules (relative imports)

#### Validation & Transformation
- Use `class-validator` decorators in DTOs
- Apply `class-transformer` for data transformation
- Enable global validation pipe with whitelist and transform options

### Database & Entity Guidelines
- Use TypeORM decorators for entity mapping
- Follow repository pattern with clear interfaces
- Implement proper transaction management using @nestjs-cls/transactional
- Use UUID for primary keys when appropriate
- Apply proper indexing strategies

### Testing Standards
- **Unit Tests**: Test business logic in isolation
- **Integration Tests**: Test adapter implementations
- **E2E Tests**: Test complete user journeys
- Use Vitest as the testing framework
- Mock external dependencies properly
- Achieve good test coverage (aim for >80%)

### Authentication & Authorization
- Use JWT tokens with Passport.js strategy
- Implement proper guards for route protection
- Hash passwords with Argon2
- Apply role-based access control when needed

### API Documentation
- Use Swagger decorators on controllers and DTOs
- Provide comprehensive API documentation
- Include authentication schemes in Swagger config
- Document error responses properly

### Error Handling
- Create custom exception classes when needed
- Use appropriate HTTP status codes
- Provide meaningful error messages
- Log errors appropriately with Pino logger

### Configuration Management
- Use @nestjs/config for environment variables
- Separate configuration by concern (database, auth, http, etc.)
- Validate configuration schemas
- Support different environments (development, production, test)

### Performance Considerations
- Implement proper caching strategies when needed
- Use database indexing appropriately
- Apply pagination for list endpoints
- Consider query optimization for complex operations

## Development Workflow

### Adding New Features
1. Define domain requirements
2. Create domain entities with business rules
3. Write domain tests
4. Implement use cases
5. Write use case tests
6. Create adapter implementations
7. Add API endpoints with proper validation
8. Update Swagger documentation
9. Add integration/E2E tests
10. Update module configurations

### Code Quality Checks
- Run `pnpm lint` for linting
- Run `pnpm test` for unit tests
- Run `pnpm test:cov` for coverage reports
- Run `pnpm test:e2e` for end-to-end tests
- Use Prettier for code formatting

### Database Migrations
- Create TypeORM migrations for schema changes
- Test migrations in development environment
- Apply migrations in production safely

## Common Patterns & Examples

### Domain Pattern
```typescript
import { Brand, CreatedAt, Status, UpdatedAt } from 'src/types/utility.type';

export type {Entity}Id = Brand<string, '{Entity}Id'>;
export type {Entity}Name = Brand<string, '{Entity}Name'>;
export type {Entity}Price = Brand<number, '{Entity}Price'>;
export type {Entity}Description = Brand<string, '{Entity}Description'>;
export type {Entity}Image = Brand<string, '{Entity}Image'>;
export type {Entity}CreatedAt = Brand<CreatedAt, '{Entity}CreatedAt'>;
export type {Entity}UpdatedAt = Brand<UpdatedAt, '{Entity}UpdatedAt'>;

export interface I{Entity} {
  uuid: {Entity}Id;
  name: {Entity}Name;
  price: {Entity}Price;
  description?: {Entity}Description;
  status: Status;
  image?: {Entity}Image;
  createdAt?: {Entity}CreatedAt;
  updatedAt?: {Entity}UpdatedAt;
}

export class {Entity} implements I{Entity} {
  uuid: {Entity}Id;
  name: {Entity}Name;
  price: {Entity}Price;
  description?: {Entity}Description;
  status: Status;
  image?: {Entity}Image;
  createdAt?: {Entity}CreatedAt;
  updatedAt?: {Entity}UpdatedAt;
}
```

### Create Entity Pattern

```typescript

export const {entity}TableName = '{entity}s';

@Entity({
  name: {entity}TableName,
})
export class {Entity}Entity {
  @PrimaryColumn({
    type: 'uuid',
  })
  uuid: {Entity}Id;

  @Column({
    type: 'varchar',
  })
  name: {Entity}Name;

  @Column({
    type: 'float',
  })
  price: {Entity}Price;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  description?: {Entity}Description;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  image?: {Entity}Image;

  @Column({
    type: 'varchar',
    default: 'active',
  })
  status: Status;

  @CreateDateColumn()
  declare createdAt: {Entity}CreatedAt;

  @UpdateDateColumn()
  declare updatedAt: {Entity}UpdatedAt;
}
```

### Repository Implementation Pattern
```typescript 

// Port (Interface)
import { GetAllMetaType, GetAllParamsType } from 'src/types/utility.type';
import { I{Entity}, {Entity}Id } from '../domains/{entity}.domain';

export type Create{Entity}Command = Omit<I{Entity}, 'uuid' | 'status' | 'createdAt' | 'updatedAt'>;

export interface GetAllReturnType {
  result: I{Entity}[];
  meta: GetAllMetaType;
}

const {entity}RepositoryTokenSymbol: unique symbol = Symbol('{Entity}Repository');
export const {entity}RepositoryToken = {entity}RepositoryTokenSymbol.toString();

export interface {Entity}Repository {
  create({entity}: Create{Entity}Command): Promise<I{Entity}>;
  deleteById(id: {Entity}Id): Promise<void>;
  getAll(params: GetAllParamsType): Promise<GetAllReturnType>;
  getById(id: {Entity}Id): Promise<I{Entity} | undefined>;
  updateById(id: {Entity}Id, {entity}: Partial<I{Entity}>): Promise<I{Entity}>;
}

// Adapter (Implementation)
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';
import { Builder, StrictBuilder } from 'builder-pattern';
import {
  IProduct,
  Product,
  ProductCreatedAt,
  ProductDescription,
  ProductId,
  ProductImage,
  ProductName,
  ProductPrice,
  ProductUpdatedAt,
} from 'src/products/applications/domains/product.domain';
import {
  CreateProductCommand,
  GetAllReturnType,
  ProductRepository,
} from 'src/products/applications/ports/product.repository';
import { GetAllMetaType, GetAllParamsType, type Status } from 'src/types/utility.type';
import { v4 as uuidv4 } from 'uuid';
import { ProductEntity } from './product.entity';
@Injectable()
export class ProductTypeOrmRepository implements ProductRepository {
  constructor(private readonly productModel: TransactionHost<TransactionalAdapterTypeOrm>) {}

  async create(product: CreateProductCommand): Promise<IProduct> {
    const uuid = uuidv4() as ProductId;
    const resultCreated = await this.productModel.tx.getRepository(ProductEntity).save({
      uuid: uuid,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
    });
    return ProductTypeOrmRepository.toDomain(resultCreated as ProductEntity);
  }

  async deleteById(id: ProductId): Promise<void> {
    await this.productModel.tx.getRepository(ProductEntity).delete({ uuid: id });
  }

  async getAll(params: GetAllParamsType): Promise<GetAllReturnType> {
    const { search, sort, order, page, limit } = params;

    const currentPage = page ?? 1;
    const currentLimit = limit ?? 10;

    const queryBuilder = this.productModel.tx.getRepository(ProductEntity).createQueryBuilder('product');

    if (search) {
      queryBuilder.where('product.name LIKE :search', { search: `%${search}%` });
    }

    const sortableColumns = ['name', 'price', 'createdAt'];
    if (sort && sortableColumns.includes(sort)) {
      queryBuilder.orderBy(`product.${sort}`, order === 'ASC' ? 'ASC' : 'DESC');
    }

    if (currentLimit !== -1) {
      queryBuilder.skip((currentPage - 1) * currentLimit).take(currentLimit);
    }

    const [products, count] = await queryBuilder.getManyAndCount();

    const result = products.map((product) => ProductTypeOrmRepository.toDomain(product));

    const meta = StrictBuilder<GetAllMetaType>().page(currentPage).limit(currentLimit).total(count).build();

    return StrictBuilder<GetAllReturnType>().result(result).meta(meta).build();
  }

  async getById(id: ProductId): Promise<IProduct | undefined> {
    const product = await this.productModel.tx.getRepository(ProductEntity).findOne({
      where: {
        uuid: id,
      },
    });
    return product ? ProductTypeOrmRepository.toDomain(product) : undefined;
  }

  async updateById(id: ProductId, product: Partial<IProduct>): Promise<IProduct> {
    await this.productModel.tx.getRepository(ProductEntity).update({ uuid: id }, product);
    const updatedProduct = await this.productModel.tx.getRepository(ProductEntity).findOne({
      where: {
        uuid: id,
      },
    });
    return ProductTypeOrmRepository.toDomain(updatedProduct as ProductEntity);
  }

  public static toDomain(productEntity: ProductEntity): IProduct {
    return Builder(Product)
      .uuid(productEntity.uuid as ProductId)
      .name(productEntity.name as ProductName)
      .price(productEntity.price as ProductPrice)
      .description(productEntity.description as ProductDescription)
      .image(productEntity.image as ProductImage)
      .status(productEntity.status as Status)
      .createdAt(productEntity.createdAt as ProductCreatedAt)
      .updatedAt(productEntity.updatedAt as ProductUpdatedAt)
      .build();
  }
}
```

### Use Case Pattern
```typescript
@Injectable()
export class DeleteProductByIdUseCase {
  constructor(
    @Inject(productRepositoryToken)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: ProductId): Promise<void> {
    // Business logic
  }
}
```

### Test Pattern
#### testing ruls 1. Arrange 2. Act 3. Assert

```typescript
describe('DeleteProductByIdUseCase', () => {
  let deleteProductByIdUseCase: DeleteProductByIdUseCase;
  const productRepository = mock<ProductRepository>();

  beforeEach(() => {
    deleteProductByIdUseCase = new DeleteProductByIdUseCase(productRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const productId = faker.string.uuid() as ProductId;
  it('should be throw error when product not found', async () => {
    //Arrange
    productRepository.getById.mockResolvedValue(undefined);
    const errorExpected = new NotFoundException('Product not found');

    //Act
    const actual = deleteProductByIdUseCase.execute(productId);

    //Assert
    await expect(actual).rejects.toThrow(errorExpected);
    expect(productRepository.getById).toHaveBeenCalledWith(productId);
    expect(productRepository.deleteById).not.toHaveBeenCalled();
  });

  it('should be delete product', async () => {
    //Arrange
    productRepository.getById.mockResolvedValue(mock<IProduct>({ uuid: productId }));
    productRepository.deleteById.mockResolvedValue(undefined);

    //Act
    const actual = await deleteProductByIdUseCase.execute(productId);
    //Assert
    expect(actual).toBeUndefined();
    expect(productRepository.getById).toHaveBeenCalledWith(productId);
    expect(productRepository.deleteById).toHaveBeenCalledWith(productId);
  });
});
```

### Controller Pattern
```typescript

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly deleteProductByIdUseCase: DeleteProductByIdUseCase,
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    private readonly updateProductByIdUseCase: UpdateProductByIdUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
  ) {}

  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The product has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Post()
  @Transactional()
  create(@Body() createProductDto: CreateProductDto): Promise<IProduct> {
    const command = Builder<IProduct>()
      .name(createProductDto.name as ProductName)
      .price(createProductDto.price as ProductPrice)
      .image(createProductDto.image as ProductImage)
      .description(createProductDto.description as ProductDescription)
      .build();
    return this.createProductUseCase.execute(command);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The products have been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Transactional()
  @Get()
  getAll(): Promise<IProduct[]> {
    return this.getAllProductsUseCase.execute();
  }

  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The product has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The product not found in the system.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Transactional()
  @ApiParam({ name: 'id', type: String, description: 'The id of the product' })
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: ProductId): Promise<void> {
    return this.deleteProductByIdUseCase.execute(id);
  }

  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The product has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The product not found in the system.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @ApiParam({ name: 'id', type: String, description: 'The id of the product' })
  @Transactional()
  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: ProductId, @Body() updateProductDto: UpdateProductDto): Promise<IProduct> {
    const command = Builder<IProduct>()
      .name(updateProductDto.name as ProductName)
      .price(updateProductDto.price as ProductPrice)
      .image(updateProductDto.image as ProductImage)
      .description(updateProductDto.description as ProductDescription)
      .status(updateProductDto.status as Status)
      .build();
    return this.updateProductByIdUseCase.execute(id, command);
  }

  @ApiOperation({ summary: 'Get a product by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The product has been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @ApiParam({ name: 'id', type: String, description: 'The id of the product' })
  @Transactional()
  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: ProductId): Promise<IProduct | undefined> {
    return this.getProductByIdUseCase.execute(id);
  }
}
```

### Create Dto Pattern

```typescript
export class CreateProductDto {
  @ApiProperty({
    type: String,
    example: 'John Doe',
    description: 'The name of the product in multiple languages',
  })
  @IsNotEmpty()
  name: ProductName;

  @ApiProperty({
    type: Number,
    example: 100.75,
    description: 'The price of the product',
  })
  @IsNotEmpty()
  price: ProductPrice;

  @ApiProperty({
    type: String,
    example: 'https://example.com/avatar.jpg',
    description: 'The image of the product',
  })
  @IsOptional()
  image?: ProductImage;

  @ApiProperty({
    type: String,
    example: 'This is a product description',
    description: 'The description of the product',
  })
  @IsOptional()
  description: ProductDescription;
}
```

### Update Dto Pattern

```typescript
import { IProduct } from 'src/products/applications/domains/product.domain';

export interface UpdateProductDto extends Partial<IProduct> {}
```

### Http  Rest Client File Pattern
```bash
### Login
# @name login
POST {{host}}/auth/login
content-type: application/json

{
  "username": "user2",
 "password": "12345678"
}
###

@myAccessToken = {{login.response.body.accessToken}}

### Create products
POST {{host}}/products
Content-Type: application/json
authorization: Bearer {{myAccessToken}}

{ 

    "name": "Product new 66",
    "price": 100,
    "image": "https://example.com/avatar.jpg",
    "description": "This is a product description"
}

### Get All Products
GET {{host}}/products
authorization: Bearer {{myAccessToken}}

### Get Product By Id
GET {{host}}/products/5b33cbbe-8294-4083-9a4c-981f6bd08533
authorization: Bearer {{myAccessToken}}

### Delete Product By Id
DELETE {{host}}/products/5efeac2d-ef72-4ebe-a851-48f0e6b8fca8
authorization: Bearer {{myAccessToken}}

### Update Product By Id
PUT {{host}}/products/5b33cbbe-8294-4083-9a4c-981f6bd08533
Content-Type: application/json
authorization: Bearer {{myAccessToken}}

{
    "name": "Product new 99 update",
    "price": 1000,
    "image": "https://example.com/avatar.jpg",
    "description": "This is a product description"
}
```

## Project-Specific Notes
- The project uses Thai comments in some places - maintain consistency with existing code style
- CORS is configured for `http://localhost:7000`
- Default password functionality exists (check environment variables)
- Transaction support is available through @nestjs-cls/transactional
- Logging is configured with Pino for structured logging

---

**Remember**: Always maintain the hexagonal architecture principles, write tests, and follow the established patterns when extending this codebase.
