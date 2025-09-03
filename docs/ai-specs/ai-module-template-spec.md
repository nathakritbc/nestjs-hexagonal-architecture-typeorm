# AI Module Template Specification - NestJS Hexagonal Architecture

## 🎯 Overview

This template provides a standardized approach for creating new modules within the NestJS Hexagonal Architecture project. Follow this guide to implement new domain modules consistently and efficiently.

## 📋 Quick Start Checklist

### Pre-Development
- [ ] Define module domain and boundaries
- [ ] Identify business entities and value objects
- [ ] List required use cases and operations
- [ ] Plan external dependencies and integrations
- [ ] Design database schema requirements

### Development Phases
- [ ] **Phase 1**: Write UseCase tests first (TDD approach)
- [ ] **Phase 2**: Implement domain layer (business logic)
- [ ] **Phase 3**: Create repository interface (port)
- [ ] **Phase 4**: Implement use cases (application logic)
- [ ] **Phase 5**: Create database adapters (TypeORM)
- [ ] **Phase 6**: Build API controllers (inbound adapters)
- [ ] **Phase 7**: Configure module and run tests

## 🏗️ Module Structure

```
src/{MODULE_NAME}/
├── adapters/
│   ├── inbounds/                    # API Layer
│   │   ├── {ENTITY_NAME}.controller.ts
│   │   ├── create{ENTITY_NAME}.dto.ts
│   │   ├── update{ENTITY_NAME}.dto.ts
│   │   ├── {ENTITY_NAME}Response.dto.ts
│   │   └── {ENTITY_NAME}.http      # HTTP client testing
│   └── outbounds/                   # Database Layer
│       ├── {ENTITY_NAME}.entity.ts
│       └── {ENTITY_NAME}.typeorm.repository.ts
├── applications/
│   ├── domains/                     # Business Logic
│   │   ├── {ENTITY_NAME}.domain.ts
│   │   └── {ENTITY_NAME}.domain.spec.ts  # Only if domain has methods
│   ├── ports/                       # Repository Interface
│   │   └── {ENTITY_NAME}.repository.ts
│   └── usecases/                    # Application Logic
│       ├── create{ENTITY_NAME}.usecase.ts
│       ├── create{ENTITY_NAME}.usecase.spec.ts
│       ├── get{ENTITY_NAME}ById.usecase.ts
│       ├── get{ENTITY_NAME}ById.usecase.spec.ts
│       ├── getAll{ENTITY_NAME}s.usecase.ts
│       ├── getAll{ENTITY_NAME}s.usecase.spec.ts
│       ├── update{ENTITY_NAME}.usecase.ts
│       ├── update{ENTITY_NAME}.usecase.spec.ts
│       ├── delete{ENTITY_NAME}.usecase.ts
│       └── delete{ENTITY_NAME}.usecase.spec.ts
└── {MODULE_NAME}.module.ts
```

## 🧪 TDD-First Development Approach

### Core Principles
1. **Test First**: Write failing tests before implementation
2. **Red → Green → Refactor**: Fail → Pass → Improve cycle
3. **100% Coverage**: Aim for complete test coverage on business logic
4. **Mock Dependencies**: Keep tests isolated from infrastructure

### Testing Commands
```bash
pnpm test:watch          # Run tests continuously
pnpm test {file}         # Run specific test file
pnpm test:cov            # Check coverage report
pnpm test:e2e            # Run end-to-end tests
```

### Testing Order
1. **UseCase Tests First** → Implement UseCase → **Domain Tests** (if methods exist)
2. Keep repository dependencies mocked
3. Focus on business logic isolation
4. Reference: `docs/ai-specs/unit-test-spec.md` for detailed patterns

## 🎯 Implementation Steps

### Step 1: Domain Layer (Core Business Logic)

#### Domain Entity Template
```typescript
import { Builder } from 'builder-pattern';
import type { Brand, Status } from 'src/types/utility.type';

// Branded types for type safety
export type {ENTITY_NAME}Id = Brand<string, '{ENTITY_NAME}Id'>;
export type {ENTITY_NAME}Price = Brand<number, '{ENTITY_NAME}Price'>;
export type {ENTITY_NAME}CreatedAt = Brand<CreatedAt, '{ENTITY_NAME}CreatedAt'>;
export type {ENTITY_NAME}UpdatedAt = Brand<UpdatedAt, '{ENTITY_NAME}UpdatedAt'>;

export interface I{ENTITY_NAME} {
  uuid: {ENTITY_NAME}Id;
  price: {ENTITY_NAME}Price;
  status: Status;
  createdAt?: {ENTITY_NAME}CreatedAt;
  updatedAt?: {ENTITY_NAME}UpdatedAt;
  // Add your domain properties here
}

export class {ENTITY_NAME} implements I{ENTITY_NAME} {
  uuid: {ENTITY_NAME}Id;
  price: {ENTITY_NAME}Price;
  status: Status;
  createdAt?: {ENTITY_NAME}CreatedAt;
  updatedAt?: {ENTITY_NAME}UpdatedAt;
  
  // Add business logic methods ONLY if needed
  // Example: validate(), canBeDeleted(), etc.
  // Do not create methods just for the sake of having them
}
```

#### Domain Test Template (Only if domain has methods)
```typescript
import { describe, it, expect } from 'vitest';
import { {ENTITY_NAME} } from './{ENTITY_NAME}.domain';

describe('{ENTITY_NAME}Domain', () => {
  describe('business logic methods', () => {
    it('should validate required properties', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Step 2: Repository Interface (Port)

#### Repository Interface Template
```typescript
import { GetAllMetaType, GetAllParamsType } from 'src/types/utility.type';
import { {Entity}Id, I{Entity} } from '../domains/{entity}.domain';

export type Update{Entity}Command = Partial<Omit<I{Entity}, 'uuid' | 'createdAt' | 'updatedAt'>>;

export interface GetAll{Entity}ReturnType {
  result: I{Entity}[];
  meta: GetAllMetaType;
}

const {entity}RepositoryTokenSymbol: unique symbol = Symbol('{Entity}Repository');
export const {entity}RepositoryToken = {entity}RepositoryTokenSymbol.toString();

export interface {Entity}Repository {
  create({Entity}: I{Entity}): Promise<I{Entity}>;
  delete{Entity}ById({ id }: { id: {Entity}Id }): Promise<void>;
  getAll{Entity}s(params: GetAllParamsType): Promise<GetAll{Entity}ReturnType>;
  get{Entity}ById({ id }: { id: {Entity}Id }): Promise<I{Entity} | undefined>;
  update{Entity}ById({entity}: I{Entity}): Promise<I{ENTITY_NAME}>;
}
```

### Step 3: Use Cases (Application Logic)

#### Create Use Case Template
```typescript
import { Inject, Injectable } from '@nestjs/common';
import { I{ENTITY_NAME} } from '../domains/{ENTITY_NAME}.domain';
import type { Create{ENTITY_NAME}Command, {ENTITY_NAME}Repository } from '../ports/{ENTITY_NAME}.repository';
import { {ENTITY_NAME}RepositoryToken } from '../ports/{ENTITY_NAME}.repository';

@Injectable()
export class Create{ENTITY_NAME}UseCase {
  constructor(
    @Inject({ENTITY_NAME}RepositoryToken)
    private readonly {ENTITY_NAME}Repository: {ENTITY_NAME}Repository,
  ) {}

  async execute({ENTITY_NAME}: Create{ENTITY_NAME}Command): Promise<I{ENTITY_NAME}> {
    return await this.{ENTITY_NAME}Repository.create({ENTITY_NAME});
  }
}
```

#### GetAll Use Case Template
```typescript
import { Inject, Injectable } from '@nestjs/common';
import type { GetAllParamsType } from 'src/types/utility.type';
import type { GetAllReturnType, {ENTITY_NAME}Repository } from '../ports/{ENTITY_NAME}.repository';
import { {ENTITY_NAME}RepositoryToken } from '../ports/{ENTITY_NAME}.repository';

@Injectable()
export class GetAll{ENTITY_NAME}sUseCase {
  constructor(
    @Inject({ENTITY_NAME}RepositoryToken)
    private readonly {ENTITY_NAME}Repository: {ENTITY_NAME}Repository,
  ) {}

  async execute(params: GetAllParamsType): Promise<GetAllReturnType> {
    return this.{ENTITY_NAME}Repository.getAll({
      search: params.search,
      sort: params.sort,
      order: params.order,
      page: params.page,
      limit: params.limit,
    });
  }
}
```

#### GetById Use Case Template
```typescript
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { {ENTITY_NAME}Id } from 'src/{entity_name}s/applications/domains/{entity_name}.domain';
import type { {ENTITY_NAME}Id, I{ENTITY_NAME} } from '../domains/{entity_name}.domain';
import type { {ENTITY_NAME}Repository } from '../ports/{entity_name}.repository';
import { {entity_name}RepositoryToken } from '../ports/{entity_name}.repository';

@Injectable()
export class Get{ENTITY_NAME}ByIdUseCase {
  constructor(
    @Inject({entity_name}RepositoryToken)
    private readonly {entity_name}Repository: {ENTITY_NAME}Repository,
  ) {}

  async execute({ id, {entity_name}Id }: { id: {ENTITY_NAME}Id; {entity_name}Id: UserId }): Promise<I{ENTITY_NAME}> {
    const {entity_name} = await this.{entity_name}Repository.get{ENTITY_NAME}ById({ id, userId });
    if (!{entity_name}) throw new NotFoundException('{ENTITY_NAME} not found');

    return {entity_name};
  }
}

```

#### UpdateById Use Case Template
```typescript
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { type I{ENTITY_NAME} } from '../domains/{entity_name}.domain';
import type { {ENTITY_NAME}Repository } from '../ports/{entity_name}.repository';
import { {entity_name}RepositoryToken } from '../ports/{entity_name}.repository';

@Injectable()
export class Update{ENTITY_NAME}ByIdUseCase {
  constructor(
    @Inject({entity_name}RepositoryToken)
    private readonly {entity_name}Repository: {ENTITY_NAME}Repository,
  ) {}

  async execute({entity_name}: I{ENTITY_NAME}): Promise<I{ENTITY_NAME}> {
    const existing{ENTITY_NAME} = await this.{entity_name}Repository.getById({ id: {entity_name}.uuid, userId: {entity_name}.userId });
    if (!existing{ENTITY_NAME}) throw new NotFoundException('{ENTITY_NAME} not found');

    return this.{entity_name}Repository.update{ENTITY_NAME}ById({entity_name});
  }
}


```

#### Delete Use Case Template
```typescript
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { {ENTITY_NAME}Id } from '../domains/{ENTITY_NAME}.domain';
import type { {ENTITY_NAME}Repository } from '../ports/{ENTITY_NAME}.repository';
import { {ENTITY_NAME}RepositoryToken } from '../ports/{ENTITY_NAME}.repository';

@Injectable()
export class Delete{ENTITY_NAME}ByIdUseCase {
  constructor(
    @Inject({ENTITY_NAME}RepositoryToken)
    private readonly {ENTITY_NAME}Repository: {ENTITY_NAME}Repository,
  ) {}

  async execute(id: {ENTITY_NAME}Id): Promise<void> {
    const {ENTITY_NAME}Found = await this.{ENTITY_NAME}Repository.getById(id);
    if (!{ENTITY_NAME}Found) throw new NotFoundException('{ENTITY_NAME} not found');
    return this.{ENTITY_NAME}Repository.deleteById(id);
  }
}
```

### Step 4: Database Layer (Outbound Adapters)

#### TypeORM Entity Template
```typescript
import type {
  {ENTITY_NAME}CreatedAt,
  {ENTITY_NAME}Description,
  {ENTITY_NAME}Id,
  {ENTITY_NAME}Image,
  {ENTITY_NAME}Name,
  {ENTITY_NAME}Price,
  {ENTITY_NAME}UpdatedAt,
} from 'src/{ENTITY_NAME}s/applications/domains/{ENTITY_NAME}.domain';
import type { Status } from 'src/types/utility.type';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export const {ENTITY_NAME}TableName = '{ENTITY_NAME}s';

@Entity({ name: {ENTITY_NAME}TableName })
export class {ENTITY_NAME}Entity {
  @PrimaryColumn({
    type: 'uuid',
    name: 'uuid',
    default: 'gen_random_uuid()',
  })
  uuid: {Entity}Id;

  @Column({ type: 'varchar' })
  name: {ENTITY_NAME}Name;

  @Column({ type: 'float' })
  price: {ENTITY_NAME}Price;

  @Column({ type: 'varchar', nullable: true })
  description?: {ENTITY_NAME}Description;

  @Column({ type: 'varchar', default: 'active' })
  status: Status;

  @CreateDateColumn()
  declare createdAt: {ENTITY_NAME}CreatedAt;

  @UpdateDateColumn()
  declare updatedAt: {ENTITY_NAME}UpdatedAt;
}
```

#### Repository Implementation Template
```typescript
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';
import { Builder, StrictBuilder } from 'builder-pattern';
import type { I{ENTITY_NAME}, {ENTITY_NAME}Id } from '../domains/{ENTITY_NAME}.domain';
import { {ENTITY_NAME}Repository } from '../ports/{ENTITY_NAME}.repository';
import { GetAllMetaType, GetAllParamsType } from 'src/types/utility.type';
import { {ENTITY_NAME}Entity } from './{ENTITY_NAME}.entity';

@Injectable()
export class {ENTITY_NAME}TypeOrmRepository implements {ENTITY_NAME}Repository {
  constructor(private readonly {ENTITY_NAME}Model: TransactionHost<TransactionalAdapterTypeOrm>) {}

  async create({ENTITY_NAME}: I{ENTITY_NAME}): Promise<I{ENTITY_NAME}> {
    const resultCreated = await this.{ENTITY_NAME}Model.tx
      .getRepository({ENTITY_NAME}Entity)
      .save({ENTITY_NAME});
    return {ENTITY_NAME}TypeOrmRepository.toDomain(resultCreated as {ENTITY_NAME}Entity);
  }

  async deleteById(id: {ENTITY_NAME}Id): Promise<void> {
    await this.{ENTITY_NAME}Model.tx
      .getRepository({ENTITY_NAME}Entity)
      .delete({ uuid: id });
  }

  async getAll(params: GetAll{Entity}Query): Promise<GetAll{Entity}ReturnType> {
    const { search, sort, order, page, limit, category, startDate, endDate } = params;
    const currentPage = page ?? 1;
    const currentLimit = limit ?? 10;

    const repo = this.{entity}Model.tx.getRepository({Entity}Entity);
    const qb = repo.createQueryBuilder('{entity}');

    // Apply filters
    if (search) {
      qb.andWhere('({entity}.title ILIKE :search OR {entity}.notes ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (category) {
      qb.andWhere('{entity}.category = :category', { category });
    }

    if (startDate) {
      qb.andWhere('{entity}.date >= :startDate', { startDate: new Date(startDate) });
    }

    if (endDate) {
      qb.andWhere('{entity}.date <= :endDate', { endDate: new Date(endDate) });
    }

    // Sorting and pagination
    const sortableColumns = ['title', 'amount', 'date', 'category', 'createdAt'];
    if (sort && sortableColumns.includes(sort)) {
      qb.orderBy(`{entity}.${sort}`, order === 'ASC' ? 'ASC' : 'DESC');
    } else {
      qb.orderBy('{entity}.date', 'DESC');
    }

    if (currentLimit !== -1) {
      qb.skip((currentPage - 1) * currentLimit).take(currentLimit);
    }

    const [{entity}s, count] = await qb.getManyAndCount();
    const result = {entity}s.map(({entity}) => {Entity}TypeOrmRepository.toDomain({entity}));

    const totalPages = currentLimit === -1 ? 1 : Math.ceil(count / currentLimit);
    const meta = StrictBuilder<GetAllMetaType>()
      .page(currentPage)
      .limit(currentLimit)
      .total(count)
      .totalPages(totalPages)
      .build();

    return StrictBuilder<GetAll{entity}sReturnType>().result(result).meta(meta).build();
  }

  async updateById(id: {ENTITY_NAME}Id, {ENTITY_NAME}: Partial<I{ENTITY_NAME}>): Promise<I{ENTITY_NAME}> {
    await this.{ENTITY_NAME}Model.tx
      .getRepository({ENTITY_NAME}Entity)
      .update({ uuid: id }, {ENTITY_NAME});
    
    const updated{ENTITY_NAME} = await this.{ENTITY_NAME}Model.tx
      .getRepository({ENTITY_NAME}Entity)
      .findOne({ where: { uuid: id } });
    
    return {ENTITY_NAME}TypeOrmRepository.toDomain(updated{ENTITY_NAME} as {ENTITY_NAME}Entity);
  }

  public static toDomain({ENTITY_NAME}Entity: {ENTITY_NAME}Entity): I{ENTITY_NAME} {
    return Builder<I{ENTITY_NAME}>()
      .uuid({ENTITY_NAME}Entity.uuid as {ENTITY_NAME}Id)
      .name({ENTITY_NAME}Entity.name as {ENTITY_NAME}Name)
      .price({ENTITY_NAME}Entity.price as {ENTITY_NAME}Price)
      .description({ENTITY_NAME}Entity.description as {ENTITY_NAME}Description)
      .status({ENTITY_NAME}Entity.status as Status)
      .createdAt({ENTITY_NAME}Entity.createdAt as {ENTITY_NAME}CreatedAt)
      .updatedAt({ENTITY_NAME}Entity.updatedAt as {ENTITY_NAME}UpdatedAt)
      .build();
  }
}
```

### Step 5: API Layer (Inbound Adapters)

#### DTO Templates

**Create DTO**
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import type {
  {ENTITY_NAME}Description,
  {ENTITY_NAME}Image,
  {ENTITY_NAME}Name,
  {ENTITY_NAME}Price,
} from 'src/{ENTITY_NAME}s/applications/domains/{ENTITY_NAME}.domain';

export class Create{ENTITY_NAME}Dto {
  @ApiProperty({
    type: String,
    example: 'Sample {ENTITY_NAME}',
    description: 'The name of the {ENTITY_NAME}',
  })
  @IsNotEmpty()
  name: {ENTITY_NAME}Name;

  @ApiProperty({
    type: Number,
    example: 100.75,
    description: 'The price of the {ENTITY_NAME}',
  })
  @IsNotEmpty()
  price: {ENTITY_NAME}Price;

  @ApiProperty({
    type: String,
    example: 'https://example.com/image.jpg',
    description: 'The image URL of the {ENTITY_NAME}',
    required: false,
  })
  @IsOptional()
  image?: {ENTITY_NAME}Image;

  @ApiProperty({
    type: String,
    example: 'Description text',
    description: 'The description of the {ENTITY_NAME}',
    required: false,
  })
  @IsOptional()
  description?: {ENTITY_NAME}Description;
}
```

**Update DTO**
```typescript
import { PartialType } from '@nestjs/swagger';
import { Create{ENTITY_NAME}Dto } from './create{ENTITY_NAME}.dto';

export class Update{ENTITY_NAME}Dto extends PartialType(Create{ENTITY_NAME}Dto) {}
```

**Response DTO**
```typescript
import { ApiProperty } from '@nestjs/swagger';
import type {
  {ENTITY_NAME}Id,
  {ENTITY_NAME}CreatedAt,
  {ENTITY_NAME}UpdatedAt
} from 'src/{ENTITY_NAME}s/applications/domains/{ENTITY_NAME}.domain';

export class {ENTITY_NAME}ResponseDto {
  @ApiProperty()
  uuid: {ENTITY_NAME}Id;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  image?: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: {ENTITY_NAME}CreatedAt;

  @ApiProperty()
  updatedAt: {ENTITY_NAME}UpdatedAt;
}
```

#### Controller Template
```typescript
import { Transactional } from '@nestjs-cls/transactional';
import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import type { I{ENTITY_NAME}, {ENTITY_NAME}Id } from 'src/{ENTITY_NAME}s/applications/domains/{ENTITY_NAME}.domain';
import { Create{ENTITY_NAME}UseCase } from 'src/{ENTITY_NAME}s/applications/usecases/create{ENTITY_NAME}.usecase';
import { Delete{ENTITY_NAME}ByIdUseCase } from 'src/{ENTITY_NAME}s/applications/usecases/delete{ENTITY_NAME}ById.usecase';
import { GetAll{ENTITY_NAME}sUseCase } from 'src/{ENTITY_NAME}s/applications/usecases/getAll{ENTITY_NAME}s.usecase';
import { Get{ENTITY_NAME}ByIdUseCase } from 'src/{ENTITY_NAME}s/applications/usecases/get{ENTITY_NAME}ById.usecase';
import { Update{ENTITY_NAME}ByIdUseCase } from 'src/{ENTITY_NAME}s/applications/usecases/update{ENTITY_NAME}ById.usecase';
import { Create{ENTITY_NAME}Dto } from './dto/create{ENTITY_NAME}.dto';
import type { Update{ENTITY_NAME}Dto } from './dto/update{ENTITY_NAME}.dto';

@UseGuards(JwtAuthGuard)
@Controller('{ENTITY_NAME}s')
export class {ENTITY_NAME}Controller {
  constructor(
    private readonly create{ENTITY_NAME}UseCase: Create{ENTITY_NAME}UseCase,
    private readonly delete{ENTITY_NAME}ByIdUseCase: Delete{ENTITY_NAME}ByIdUseCase,
    private readonly getAll{ENTITY_NAME}sUseCase: GetAll{ENTITY_NAME}sUseCase,
    private readonly update{ENTITY_NAME}ByIdUseCase: Update{ENTITY_NAME}ByIdUseCase,
    private readonly get{ENTITY_NAME}ByIdUseCase: Get{ENTITY_NAME}ByIdUseCase,
  ) {}

  @ApiOperation({ summary: 'Create a {ENTITY_NAME}' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The {ENTITY_NAME} has been successfully created.' })
  @Post()
  @Transactional()
  create(@Body() create{ENTITY_NAME}Dto: Create{ENTITY_NAME}Dto): Promise<I{ENTITY_NAME}> {
    const command = Builder<I{ENTITY_NAME}>()
      .name(create{ENTITY_NAME}Dto.name)
      .price(create{ENTITY_NAME}Dto.price)
      .image(create{ENTITY_NAME}Dto.image)
      .description(create{ENTITY_NAME}Dto.description)
      .build();
    return this.create{ENTITY_NAME}UseCase.execute(command);
  }

  @ApiOperation({ summary: 'Get all {ENTITY_NAME}s' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The {ENTITY_NAME}s have been successfully retrieved.' })
  @Get()
  @Transactional()
  getAll(
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.getAll{ENTITY_NAME}sUseCase.execute({ search, sort, order, page, limit });
  }

  @ApiOperation({ summary: 'Get a {ENTITY_NAME} by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The {ENTITY_NAME} has been successfully retrieved.' })
  @ApiParam({ name: 'id', type: String, description: 'The id of the {ENTITY_NAME}' })
  @Get(':id')
  @Transactional()
  getById(@Param('id', ParseUUIDPipe) id: {ENTITY_NAME}Id): Promise<I{ENTITY_NAME} | undefined> {
    return this.get{ENTITY_NAME}ByIdUseCase.execute(id);
  }

  @ApiOperation({ summary: 'Update a {ENTITY_NAME}' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The {ENTITY_NAME} has been successfully updated.' })
  @ApiParam({ name: 'id', type: String, description: 'The id of the {ENTITY_NAME}' })
  @Put(':id')
  @Transactional()
  update(@Param('id', ParseUUIDPipe) id: {ENTITY_NAME}Id, @Body() update{ENTITY_NAME}Dto: Update{ENTITY_NAME}Dto): Promise<I{ENTITY_NAME}> {
    const command = Builder<I{ENTITY_NAME}>()
      .name(update{ENTITY_NAME}Dto.name)
      .price(update{ENTITY_NAME}Dto.price)
      .image(update{ENTITY_NAME}Dto.image)
      .description(update{ENTITY_NAME}Dto.description)
      .build();
    return this.update{ENTITY_NAME}ByIdUseCase.execute(id, command);
  }

  @ApiOperation({ summary: 'Delete a {ENTITY_NAME}' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The {ENTITY_NAME} has been successfully deleted.' })
  @ApiParam({ name: 'id', type: String, description: 'The id of the {ENTITY_NAME}' })
  @Delete(':id')
  @Transactional()
  delete(@Param('id', ParseUUIDPipe) id: {ENTITY_NAME}Id): Promise<void> {
    return this.delete{ENTITY_NAME}ByIdUseCase.execute(id);
  }
}
```

### Step 6: Module Configuration

#### Module Template
```typescript
import { Module } from '@nestjs/common';

// Controllers
import { {ENTITY_NAME}Controller } from './adapters/inbounds/{ENTITY_NAME}.controller';

// Use Cases
import { Create{ENTITY_NAME}UseCase } from './applications/usecases/create{ENTITY_NAME}.usecase';
import { Delete{ENTITY_NAME}ByIdUseCase } from './applications/usecases/delete{ENTITY_NAME}ById.usecase';
import { GetAll{ENTITY_NAME}sUseCase } from './applications/usecases/getAll{ENTITY_NAME}s.usecase';
import { Get{ENTITY_NAME}ByIdUseCase } from './applications/usecases/get{ENTITY_NAME}ById.usecase';
import { Update{ENTITY_NAME}ByIdUseCase } from './applications/usecases/update{ENTITY_NAME}ById.usecase';

// Repository binding
import { {ENTITY_NAME}Repository } from './applications/ports/{ENTITY_NAME}.repository';
import { {ENTITY_NAME}TypeormRepository } from './adapters/outbounds/{ENTITY_NAME}.typeorm.repository';

@Module({
  controllers: [{ENTITY_NAME}Controller],
  providers: [
    // Use Cases
    Create{ENTITY_NAME}UseCase,
    Delete{ENTITY_NAME}ByIdUseCase,
    GetAll{ENTITY_NAME}sUseCase,
    Get{ENTITY_NAME}ByIdUseCase,
    Update{ENTITY_NAME}ByIdUseCase,

    // Repository binding
    {
      provide: {ENTITY_NAME}Repository,
      useClass: {ENTITY_NAME}TypeormRepository,
    },
  ],
  exports: [
    // Export use cases if needed by other modules
    Create{ENTITY_NAME}UseCase,
    Get{ENTITY_NAME}ByIdUseCase,
    GetAll{ENTITY_NAME}sUseCase,
  ],
})
export class {MODULE_NAME}Module {}
```

## 🗄️ Database Migration

### Migration Creation
```bash
# Create empty migration
pnpm run migration:create -- src/databases/migrations/Create{ENTITY_NAME}Table

# Generate migration from Entity changes
pnpm run migration:generate -- --name=Create{ENTITY_NAME}Table

# Run migrations
pnpm run migration:run

# Revert migration
pnpm run migration:revert

# Show migration status
pnpm run migration:show

# Check database status
pnpm run db:status
```

### Migration File Naming Convention
```
{timestamp}-{description}.ts
Example: 1756391900904-CreatePostsTable.ts
```

### Migration Template Structure
```typescript
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class Create{Entity}Table{timestamp} implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: '{entity}s',
        columns: [
          {
            name: 'uuid',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          // Add your columns here with proper types and constraints
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create indexes for better performance
    await queryRunner.createIndex(
      '{entity}s',
      new TableIndex({
        name: 'IDX_{ENTITY}_CREATED_AT',
        columnNames: ['createdAt'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes first
    await queryRunner.dropIndex('{entity}s', 'IDX_{ENTITY}_CREATED_AT');

    // Drop table
    await queryRunner.dropTable('{entity}s');
  }
}
```

### Migration Best Practices
1. **Always use proper column types**: `varchar(length)`, `text`, `decimal(precision, scale)`
2. **Add indexes** for frequently queried columns (foreign keys, search fields, dates)
3. **Use proper constraints**: `isNullable`, `isUnique`, `default` values
4. **Include rollback logic** in `down()` method
5. **Test migrations** in development before applying to production
6. **Use meaningful names** for indexes and foreign keys

> **📋 For comprehensive migration guidelines**: See `docs/ai-specs/ai-migration-spec.md`

## 🧪 Testing Strategy

### Test Coverage Requirements
- [ ] **UseCase Tests**: 100% coverage with happy paths and error scenarios
- [ ] **Domain Tests**: Only if domain contains business methods
- [ ] **Repository Tests**: Integration tests for database operations
- [ ] **Controller Tests**: API endpoint validation
- [ ] **E2E Tests**: Complete user journey validation

### Test File Naming
- Domain: `{ENTITY_NAME}.domain.spec.ts`
- UseCase: `{operation}{ENTITY_NAME}.usecase.spec.ts`
- Repository: `{ENTITY_NAME}.typeorm.repository.spec.ts`
- Controller: `{ENTITY_NAME}.controller.spec.ts`

> **📋 For detailed testing patterns**: See `docs/ai-specs/unit-test-spec.md`

## 📝 HTTP Client Testing

#### HTTP Client Template (`{ENTITY_NAME}.http`)
```http
### Login
# @name login
POST {{host}}/auth/login
content-type: application/json
{
  "username": "user2",
  "password": "12345678"
}

@myAccessToken = {{login.response.body.accessToken}}

### Create {ENTITY_NAME}
POST {{host}}/{ENTITY_NAME}s
Content-Type: application/json
authorization: Bearer {{myAccessToken}}
{
  "name": "{ENTITY_NAME} new",
  "price": 100,
  "image": "https://example.com/image.jpg",
  "description": "This is a {ENTITY_NAME} description"
}

### Get All {ENTITY_NAME}s
GET {{host}}/{ENTITY_NAME}s
authorization: Bearer {{myAccessToken}}

### Get {ENTITY_NAME} By Id
GET {{host}}/{ENTITY_NAME}s/{{uuid}}
authorization: Bearer {{myAccessToken}}

### Update {ENTITY_NAME}
PUT {{host}}/{ENTITY_NAME}s/{{uuid}}
Content-Type: application/json
authorization: Bearer {{myAccessToken}}
{
  "name": "{ENTITY_NAME} updated",
  "price": 200,
  "description": "Updated description"
}

### Delete {ENTITY_NAME}
DELETE {{host}}/{ENTITY_NAME}s/{{uuid}}
authorization: Bearer {{myAccessToken}}
```

## ✅ Final Verification Checklist

### Code Quality
- [ ] Run `pnpm lint` - no linting errors
- [ ] Run `pnpm test` - all tests passing
- [ ] Run `pnpm test:cov` - 100% coverage on business logic
- [ ] Run `pnpm test:e2e` - integration tests passing

### Architecture Compliance
- [ ] Hexagonal architecture layers properly separated
- [ ] Dependency injection correctly configured
- [ ] Repository pattern implemented
- [ ] Use cases isolated from infrastructure
- [ ] Domain logic pure and testable

### API Documentation
- [ ] Swagger documentation complete
- [ ] DTOs properly validated
- [ ] Error handling implemented
- [ ] HTTP status codes correct
- [ ] Authentication guards applied

### Database
- [ ] Migration created and tested
- [ ] Entity mappings correct
- [ ] Indexes added for performance
- [ ] Rollback methods safe

## 🚀 Module Registration

Add to `app.module.ts`:
```typescript
import { {MODULE_NAME}Module } from './{MODULE_NAME}/{MODULE_NAME}.module';

@Module({
  imports: [
    // ... existing imports
    {MODULE_NAME}Module,
  ],
})
export class AppModule {}
```

## 💡 Best Practices

### Code Quality
- Use `Builder<T>()` pattern instead of object literals
- Avoid spread operator `...` - prefer explicit fields
- Never use `any` - use precise types or `unknown`
- Follow AAA testing pattern: Arrange, Act, Assert

### Performance
- Add database indexes for frequently queried fields
- Implement pagination for list endpoints
- Use caching for read-heavy operations

### Security
- Validate all inputs with class-validator
- Implement proper authorization checks
- Sanitize output data
- Use JWT authentication guards

---

**🎯 Remember**: This template ensures consistency across all modules while maintaining hexagonal architecture principles. Adapt patterns to fit your specific domain requirements while keeping the core structure intact.
