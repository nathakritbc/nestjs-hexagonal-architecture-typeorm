# AI Module Template Specification - NestJS Hexagonal Architecture

## Template Overview

This template provides a standardized approach for creating new modules within the NestJS Hexagonal Architecture project. Use this as a guide when implementing new domain modules.

## Module Creation Checklist

### Pre-Development Planning

- [ ] Define module domain and boundaries
- [ ] Identify business entities and value objects
- [ ] List required use cases and operations
- [ ] Plan external dependencies and integrations
- [ ] Design database schema requirements

## Module Structure Template

Replace `{MODULE_NAME}` and `{ENTITY_NAME}` with your actual module and entity names:

```text
src/{MODULE_NAME}/
├── adapters/
│   ├── inbounds/
│   │   ├── {ENTITY_NAME}.controller.ts
│   │   ├── create{ENTITY_NAME}.dto.ts
│   │   ├── update{ENTITY_NAME}.dto.ts
│   │   ├── {ENTITY_NAME}Response.dto.ts
│   │   └── {ENTITY_NAME}.http (optional HTTP client file)
│   └── outbounds/
│       ├── {ENTITY_NAME}.entity.ts
│       └── {ENTITY_NAME}.typeorm.repository.ts
├── applications/
│   ├── domains/
│   │   ├── {ENTITY_NAME}.domain.ts
│   │   └── {ENTITY_NAME}.domain.spec.ts
│   ├── ports/
│   │   └── {ENTITY_NAME}.repository.ts
│   └── usecases/
│       ├── create{ENTITY_NAME}.usecase.ts
│       ├── create{ENTITY_NAME}.usecase.spec.ts
│       ├── get{ENTITY_NAME}ById.usecase.ts
│       ├── get{ENTITY_NAME}ById.usecase.spec.ts
│       ├── update{ENTITY_NAME}.usecase.ts
│       ├── update{ENTITY_NAME}.usecase.spec.ts
│       ├── delete{ENTITY_NAME}.usecase.ts
│       └── delete{ENTITY_NAME}.usecase.spec.ts
└── {MODULE_NAME}.module.ts
```

### Note Generate {ENTITY_NAME}.domain.spec.ts only if the domain contains methods If the domain has no methods, do not create this file

## Implementation Steps

### Step 1: Domain Layer (Core Business Logic)

Create the domain entity first as it represents the core business concept.

#### Domain Entity Template (`{ENTITY_NAME}.domain.ts`)

```typescript
import { Builder } from 'builder-pattern';

//use Branded type
export type {ENTITY_NAME}Id = Brand<string, '{ENTITY_NAME}Id'>;
export type {ENTITY_NAME}Price = Brand<number, '{ENTITY_NAME}Price'>;
export type {ENTITY_NAME}CreatedAt = Brand<CreatedAt, '{ENTITY_NAME}CreatedAt'>;
export type {ENTITY_NAME}UpdatedAt = Brand<UpdatedAt, '{ENTITY_NAME}UpdatedAt'>;


export interface I{ENTITY_NAME} {
  uuid: {ENTITY_NAME}Id;
  price: {ENTITY_NAME}Price;
  // Add your domain properties here
  createdAt?: {ENTITY_NAME}CreatedAt;
  updatedAt?: {ENTITY_NAME}UpdatedAt;
}

export class {ENTITY_NAME} implements I{ENTITY_NAME}  {
  uuid: {ENTITY_NAME}Id;
  price: {ENTITY_NAME}Price;
   // Add your domain properties here

  // Add other business methods here
  // Place other business methods here.
  // Only add methods if there is actual business logic.
  // Do not create methods just for the sake of having them in the domain.

  // Business logic methods
  // Example: validate(), canBeDeleted(), etc.
}
```

#### Domain Test Template (`{ENTITY_NAME}.domain.spec.ts`)

#### Testing ruls 1. Arrange 2. Act 3. Assert

```typescript
import { describe, it, expect } from 'vitest';
import { {ENTITY_NAME}Domain } from './{ENTITY_NAME}.domain';

describe('{ENTITY_NAME}Domain', () => {
  describe('{Method Name}', () => {
    it('should create a {ENTITY_NAME} domain object', () => {
      // Test implementation
      //Arrange
      //Act
      //Assert
    });

    it('should validate required properties', () => {
      // Test validation logic
      //Arrange
      //Act
      //Assert
    });
  });

  describe('business logic methods', () => {
    // Test business logic methods
    //Arrange
    //Act
    //Assert
  });
});
```

### Step 2: Port Layer (Repository Interface)

#### Repository Interface Template (`{ENTITY_NAME}.repository.ts`)

```typescript
import type { {ENTITY_NAME},{ENTITY_NAME}Id } from '../domains/{ENTITY_NAME}.domain';

export type Create{ENTITY_NAME}Command = Omit<I{ENTITY_NAME}, 'uuid' | 'createdAt' | 'updatedAt'>;

export interface GetAllReturnType {
  result: I{ENTITY_NAME}[];
  meta: GetAllMetaType;
}

export interface {ENTITY_NAME}Repository {
  create(entity: I{ENTITY_NAME}): Promise<I{ENTITY_NAME}>;
  getById(id: {ENTITY_NAME}Id): Promise<{ENTITY_NAME}Domain | undefined>;
  getAll(params: GetAllParamsType): Promise<GetAllReturnType>;
  update(id: {ENTITY_NAME}Id, entity: Partial<I{ENTITY_NAME}>): Promise<I{ENTITY_NAME}>;
  deleteById(id: {ENTITY_NAME}Id): Promise<void>;

  // Add custom query methods as needed
  // getBySpecificCriteria(criteria: ICriteriaType): Promise<I{ENTITY_NAME}[]>;
}
```

### Step 3: Use Cases Layer

#### Create Use Case Template (`create{ENTITY_NAME}.usecase.ts`)

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
    // Save through repository
    return await this.{ENTITY_NAME}Repository.create({ENTITY_NAME});
  }
}
```

#### GetAll Use Case Template (`getAll{ENTITY_NAME}.usecase.ts`)

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

#### Delete Use Case Template (`delete{ENTITY_NAME}.usecase.ts`)

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
    //Step 1. Get data result by id
    const {ENTITY_NAME}Found = await this.{ENTITY_NAME}Repository.getById(id);

  //Step 2. Validate result and throw error
    if (!{ENTITY_NAME}Found) throw new NotFoundException('{ENTITY_NAME} not found');

    //Step 3. Return delete result
    return this.{ENTITY_NAME}Repository.deleteById(id);
  }
}
```

### Step 4: Test Layer "Test only .usecase.ts files"

> **Reference**: For comprehensive unit testing guidelines, see `src/ai-spec/unit-test-spec.md`

#### All UseCase Test Files

**📋 For complete test templates and patterns**: Follow `src/ai-spec/unit-test-spec.md`

**Required test files**:

- `create{ENTITY_NAME}.usecase.spec.ts`
- `get{ENTITY_NAME}ById.usecase.spec.ts`
- `getAll{ENTITY_NAME}s.usecase.spec.ts`
- `update{ENTITY_NAME}ById.usecase.spec.ts`
- `delete{ENTITY_NAME}ById.usecase.spec.ts`

**Each test must achieve 100% coverage** following the patterns in `unit-test-spec.md`:

- Happy path scenarios
- Error conditions (NotFoundException, ValidationException, etc.)
- Mock verification for all repository interactions
- Proper AAA pattern with Step 1. Arrange / Step 2. Act / Step 3. Assert comments

### Step 5: Outbound Adapters (Database Layer)

#### TypeORM Entity Template (`{ENTITY_NAME}.entity.ts`)

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

@Entity({
  name: {ENTITY_NAME}TableName, // Usually plural table name
})
export class {ENTITY_NAME}Entity {
  @PrimaryColumn({
    type: 'uuid',
  })
  uuid: {ENTITY_NAME}Id;

  @Column({
    type: 'varchar',
  })
  name: {ENTITY_NAME}Name;

  @Column({
    type: 'float',
  })
  price: {ENTITY_NAME}Price;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  description?: {ENTITY_NAME}Description;

  // Add your entity columns here
  // @Column()
  // name: string;

  @CreateDateColumn()
  declare createdAt: {ENTITY_NAME}CreatedAt;

  @UpdateDateColumn()
  declare updatedAt: {ENTITY_NAME}UpdatedAt;
}
```

### Step 5.1: Create Migration โดย ดูจาก Entity

> **📋 For comprehensive migration guidelines and templates**: See `ai-migration-spec.md` for detailed migration specifications, naming conventions, and best practices.

**Migration Creation Process:**

#### Step 1: Create Empty Migration File
```bash
pnpm run migration:create -- --name=Create{ENTITY_NAME}Table
```

#### Step 2: Define Migration Code Following Template
Use the migration template from `src/ai-spec/ai-migration-spec.md` to implement the `up()` and `down()` methods. The complete template includes:

- Table creation with all necessary columns
- Proper column types matching Entity decorators
- Index creation for performance optimization
- Safe rollback implementation in `down()` method

**Reference**: See `src/ai-spec/ai-migration-spec.md` for the complete migration template and detailed guidelines.

#### Step 3: Run Migration
```bash
pnpm run migration:run
```

**Key Requirements:**
- Create migrations based on Entity definitions
- Follow established naming conventions
- Include proper indexes for query performance
- Implement safe rollback methods
- Test both up() and down() methods

**Additional Migration Commands:**
```bash
# Generate migration from Entity changes (alternative approach)
pnpm run migration:generate -- --name=Create{ENTITY_NAME}Table

# Revert migration
pnpm run migration:revert

# Show migration status
pnpm run migration:show
```

#### Repository Implementation Template (`{ENTITY_NAME}.typeorm.repository.ts`)

```typescript
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';
import { Builder, StrictBuilder } from 'builder-pattern';
import type {
  I{ENTITY_NAME},
  {ENTITY_NAME},
  {ENTITY_NAME}CreatedAt,
  {ENTITY_NAME}Description,
  {ENTITY_NAME}Id,
  {ENTITY_NAME}Image,
  {ENTITY_NAME}Name,
  {ENTITY_NAME}Price,
  {ENTITY_NAME}UpdatedAt,
} from 'src/{ENTITY_NAME}s/applications/domains/{ENTITY_NAME}.domain';
import {
  Create{ENTITY_NAME}Command,
  GetAllReturnType,
  {ENTITY_NAME}Repository,
} from 'src/{ENTITY_NAME}s/applications/ports/{ENTITY_NAME}.repository';
import { GetAllMetaType, GetAllParamsType, type Status } from 'src/types/utility.type';
import { v4 as uuidv4 } from 'uuid';
import { {ENTITY_NAME}Entity } from './{ENTITY_NAME}.entity';

@Injectable()
export class {ENTITY_NAME}TypeOrmRepository implements {ENTITY_NAME}Repository {
  constructor(private readonly {ENTITY_NAME}Model: TransactionHost<TransactionalAdapterTypeOrm>) {}


  async create({ENTITY_NAME}: Create{ENTITY_NAME}Command): Promise<I{ENTITY_NAME}> {
    const uuid = uuidv4() as {ENTITY_NAME}Id;
    const resultCreated = await this.{ENTITY_NAME}Model.tx.getRepository({ENTITY_NAME}Entity).save({
      uuid: uuid,
      name: {ENTITY_NAME}.name,
      price: {ENTITY_NAME}.price,
      description: {ENTITY_NAME}.description,
      image: {ENTITY_NAME}.image,
    });
    return {ENTITY_NAME}TypeOrmRepository.toDomain(resultCreated as {ENTITY_NAME}Entity);
  }

  async deleteById(id: {ENTITY_NAME}Id): Promise<void> {
    await this.{ENTITY_NAME}Model.tx.getRepository({ENTITY_NAME}Entity).delete({ uuid: id });
  }

  async getAll(params: GetAllParamsType): Promise<GetAllReturnType> {
    const { search, sort, order, page, limit } = params;

    const currentPage = page ?? 1;
    const currentLimit = limit ?? 10;

    const queryBuilder = this.{ENTITY_NAME}Model.tx.getRepository({ENTITY_NAME}Entity).createQueryBuilder('{ENTITY_NAME}');

    if (search) {
      queryBuilder.where('{ENTITY_NAME}.name LIKE :search', { search: `%${search}%` });
    }

    const sortableColumns = ['name', 'price', 'createdAt'];
    if (sort && sortableColumns.includes(sort)) {
      queryBuilder.orderBy(`{ENTITY_NAME}.${sort}`, order === 'ASC' ? 'ASC' : 'DESC');
    }

    if (currentLimit !== -1) {
      queryBuilder.skip((currentPage - 1) * currentLimit).take(currentLimit);
    }

    const [{ENTITY_NAME}s, count] = await queryBuilder.getManyAndCount();

    const result = {ENTITY_NAME}s.map(({ENTITY_NAME}) => {ENTITY_NAME}TypeOrmRepository.toDomain({ENTITY_NAME}));

    const meta = StrictBuilder<GetAllMetaType>().page(currentPage).limit(currentLimit).total(count).build();

    return StrictBuilder<GetAllReturnType>().result(result).meta(meta).build();
  }

  async getById(id: {ENTITY_NAME}Id): Promise<I{ENTITY_NAME} | undefined> {
    const {ENTITY_NAME} = await this.{ENTITY_NAME}Model.tx.getRepository({ENTITY_NAME}Entity).findOne({
      where: {
        uuid: id,
      },
    });
    return {ENTITY_NAME} ? {ENTITY_NAME}TypeOrmRepository.toDomain({ENTITY_NAME}) : undefined;
  }

  async updateById(id: {ENTITY_NAME}Id, {ENTITY_NAME}: Partial<I{ENTITY_NAME}>): Promise<I{ENTITY_NAME}> {
    await this.{ENTITY_NAME}Model.tx.getRepository({ENTITY_NAME}Entity).update({ uuid: id }, {ENTITY_NAME});
    const updated{ENTITY_NAME} = await this.{ENTITY_NAME}Model.tx.getRepository({ENTITY_NAME}Entity).findOne({
      where: {
        uuid: id,
      },
    });
    return {ENTITY_NAME}TypeOrmRepository.toDomain(updated{ENTITY_NAME} as {ENTITY_NAME}Entity);
  }

  public static toDomain({ENTITY_NAME}Entity: {ENTITY_NAME}Entity): I{ENTITY_NAME} {
    return Builder({ENTITY_NAME})
      .uuid({ENTITY_NAME}Entity.uuid as {ENTITY_NAME}Id)
      .name({ENTITY_NAME}Entity.name as {ENTITY_NAME}Name)
      .price({ENTITY_NAME}Entity.price as {ENTITY_NAME}Price)
      .description({ENTITY_NAME}Entity.description as {ENTITY_NAME}Description)
      .image({ENTITY_NAME}Entity.image as {ENTITY_NAME}Image)
      .status({ENTITY_NAME}Entity.status as Status)
      .createdAt({ENTITY_NAME}Entity.createdAt as {ENTITY_NAME}CreatedAt)
      .updatedAt({ENTITY_NAME}Entity.updatedAt as {ENTITY_NAME}UpdatedAt)
      .build();
  }
}
```

### Step 6: Inbound Adapters (API Layer)

#### DTO Templates

**Create DTO** (`create{ENTITY_NAME}.dto.ts`)

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
    example: 'John Doe',
    description: 'The name of the {ENTITY_NAME} in multiple languages',
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
    example: 'https://example.com/avatar.jpg',
    description: 'The image of the {ENTITY_NAME}',
  })
  @IsOptional()
  image?: {ENTITY_NAME}Image;

  @ApiProperty({
    type: String,
    example: 'This is a {ENTITY_NAME} description',
    description: 'The description of the {ENTITY_NAME}',
  })
  @IsOptional()
  description: {ENTITY_NAME}Description;

  // Add other validation properties
}
```

**Update DTO** (`update{ENTITY_NAME}.dto.ts`)

```typescript
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Create{ENTITY_NAME}Dto } from './create{ENTITY_NAME}.dto';

export class Update{ENTITY_NAME}Dto extends PartialType(Create{ENTITY_NAME}Dto) {}
```

**Response DTO** (`{ENTITY_NAME}Response.dto.ts`)

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

  // Add response properties matching domain

  @ApiProperty()
  createdAt: {ENTITY_NAME}CreatedAt;

  @ApiProperty()
  updatedAt: {ENTITY_NAME}UpdatedAt;
}
```

#### Controller Template (`{ENTITY_NAME}.controller.ts`)

```typescript
import { Transactional } from '@nestjs-cls/transactional';
import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import type {
  I{ENTITY_NAME},
  {ENTITY_NAME}Description,
  {ENTITY_NAME}Id,
  {ENTITY_NAME}Name,
} from 'src/{ENTITY_NAME}s/applications/domains/{ENTITY_NAME}.domain';
import { {ENTITY_NAME}Image, {ENTITY_NAME}Price } from 'src/{ENTITY_NAME}s/applications/domains/{ENTITY_NAME}.domain';
import { Create{ENTITY_NAME}UseCase } from 'src/{ENTITY_NAME}s/applications/usecases/create{ENTITY_NAME}.usecase';
import { Delete{ENTITY_NAME}ByIdUseCase } from 'src/{ENTITY_NAME}s/applications/usecases/delete{ENTITY_NAME}ById.usecase';
import { GetAll{ENTITY_NAME}sUseCase } from 'src/{ENTITY_NAME}s/applications/usecases/getAll{ENTITY_NAME}s.usecase';
import { Get{ENTITY_NAME}ByIdUseCase } from 'src/{ENTITY_NAME}s/applications/usecases/get{ENTITY_NAME}ById.usecase';
import { Update{ENTITY_NAME}ByIdUseCase } from 'src/{ENTITY_NAME}s/applications/usecases/update{ENTITY_NAME}ById.usecase';
import { Status } from 'src/types/utility.type';
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The {ENTITY_NAME} has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Post()
  @Transactional()
  create(@Body() create{ENTITY_NAME}Dto: Create{ENTITY_NAME}Dto): Promise<I{ENTITY_NAME}> {
    const command = Builder<I{ENTITY_NAME}>()
      .name(create{ENTITY_NAME}Dto.name as {ENTITY_NAME}Name)
      .price(create{ENTITY_NAME}Dto.price as {ENTITY_NAME}Price)
      .image(create{ENTITY_NAME}Dto.image as {ENTITY_NAME}Image)
      .description(create{ENTITY_NAME}Dto.description as {ENTITY_NAME}Description)
      .build();
    return this.create{ENTITY_NAME}UseCase.execute(command);
  }

  @ApiOperation({ summary: 'Get all {ENTITY_NAME}s' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The {ENTITY_NAME}s have been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Transactional()
  @Get()
  getAll(
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<GetAllReturnType> {
    return this.getAll{ENTITY_NAME}sUseCase.execute({
      search,
      sort,
      order,
      page,
      limit,
    });
  }

  @ApiOperation({ summary: 'Delete a {ENTITY_NAME}' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The {ENTITY_NAME} has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The {ENTITY_NAME} not found in the system.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Transactional()
  @ApiParam({ name: 'id', type: String, description: 'The id of the {ENTITY_NAME}' })
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: {ENTITY_NAME}Id): Promise<void> {
    return this.delete{ENTITY_NAME}ByIdUseCase.execute(id);
  }

  @ApiOperation({ summary: 'Update a {ENTITY_NAME}' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The {ENTITY_NAME} has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The {ENTITY_NAME} not found in the system.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @ApiParam({ name: 'id', type: String, description: 'The id of the {ENTITY_NAME}' })
  @Transactional()
  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: {ENTITY_NAME}Id, @Body() update{ENTITY_NAME}Dto: Update{ENTITY_NAME}Dto): Promise<I{ENTITY_NAME}> {
    const command = Builder<I{ENTITY_NAME}>()
      .name(update{ENTITY_NAME}Dto.name as {ENTITY_NAME}Name)
      .price(update{ENTITY_NAME}Dto.price as {ENTITY_NAME}Price)
      .image(update{ENTITY_NAME}Dto.image as {ENTITY_NAME}Image)
      .description(update{ENTITY_NAME}Dto.description as {ENTITY_NAME}Description)
      .status(update{ENTITY_NAME}Dto.status as Status)
      .build();
    return this.update{ENTITY_NAME}ByIdUseCase.execute(id, command);
  }

  @ApiOperation({ summary: 'Get a {ENTITY_NAME} by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The {ENTITY_NAME} has been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @ApiParam({ name: 'id', type: String, description: 'The id of the {ENTITY_NAME}' })
  @Transactional()
  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: {ENTITY_NAME}Id): Promise<I{ENTITY_NAME} | undefined> {
    return this.get{ENTITY_NAME}ByIdUseCase.execute(id);
  }
}
```

#### Rest client Template (`{ENTITY_NAME}.http`)

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

### Create {ENTITY_NAME}s

POST {{host}}/{ENTITY_NAME}s
Content-Type: application/json
authorization: Bearer {{myAccessToken}}

{

    "name": "{ENTITY_NAME} new 66",
    "price": 100,
    "image": "https://example.com/avatar.jpg",
    "description": "This is a {ENTITY_NAME} description"
}

### Get All {ENTITY_NAME}s

GET {{host}}/{ENTITY_NAME}s
authorization: Bearer {{myAccessToken}}

### Get {ENTITY_NAME} By Id

GET {{host}}/{ENTITY_NAME}s/5b33cbbe-8294-4083-9a4c-981f6bd08533
authorization: Bearer {{myAccessToken}}

### Delete {ENTITY_NAME} By Id

DELETE {{host}}/{ENTITY_NAME}s/5efeac2d-ef72-4ebe-a851-48f0e6b8fca8
authorization: Bearer {{myAccessToken}}

### Update {ENTITY_NAME} By Id

PUT {{host}}/{ENTITY_NAME}s/5b33cbbe-8294-4083-9a4c-981f6bd08533
Content-Type: application/json
authorization: Bearer {{myAccessToken}}

{
    "name": "{ENTITY_NAME} new 99 update",
    "price": 1000,
    "image": "<https://example.com/avatar.jpg>",
    "description": "This is a {ENTITY_NAME} description"
}


```

### Step 7: Module Configuration

#### Module Template (`{MODULE_NAME}.module.ts`)

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controllers
import { {ENTITY_NAME}Controller } from './adapters/inbounds/{ENTITY_NAME}.controller';

// Use Cases
import { Create{ENTITY_NAME}UseCase } from './applications/usecases/create{ENTITY_NAME}.usecase';
import { Get{ENTITY_NAME}ByIdUseCase } from './applications/usecases/get{ENTITY_NAME}ById.usecase';
// Import other use cases

// Repositories
import { {ENTITY_NAME}Repository } from './applications/ports/{ENTITY_NAME}.repository';
import { {ENTITY_NAME}TypeormRepository } from './adapters/outbounds/{ENTITY_NAME}.typeorm.repository';

// Entities
import { {ENTITY_NAME}Entity } from './adapters/outbounds/{ENTITY_NAME}.entity';

@Module({
  imports: [],
  controllers: [{ENTITY_NAME}Controller],
  providers: [
    // Use Cases
    Create{ENTITY_NAME}UseCase,
    Get{ENTITY_NAME}ByIdUseCase,
    // Add other use cases

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
  ],
})
export class {MODULE_NAME}Module {}
```




## Module Registration

Add your new module to `app.module.ts`:

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

## Testing Strategy

> **📋 For detailed unit testing specifications**: See `src/ai-spec/unit-test-spec.md` for comprehensive testing guidelines including 100% coverage patterns, mock strategies, and complete examples.

### Test Coverage Requirements

- [ ] Domain entity tests (business logic) - **Use unit-test-spec.md guidelines**
- [ ] Use case tests (application logic) - **Use unit-test-spec.md templates**
- [ ] Repository integration tests
- [ ] Controller unit tests
- [ ] E2E tests for critical paths

### Test File Naming

- Domain tests: `{ENTITY_NAME}.domain.spec.ts`
- Use case tests: `{operation}{ENTITY_NAME}.usecase.spec.ts`
- Repository tests: `{ENTITY_NAME}.typeorm.repository.spec.ts`
- Controller tests: `{ENTITY_NAME}.controller.spec.ts`

## Database Migration

When adding new entities, create migrations:

```bash
pnpm run migration:generate -- --name=Create{ENTITY_NAME}Table
pnpm run migration:run
```

## Final Checklist

### Development Complete Checklist

- [ ] Domain entity with business logic implemented
- [ ] Repository interface (port) defined
- [ ] All use cases implemented with proper error handling
- [ ] TypeORM entity with proper mappings created
- [ ] Repository implementation with proper conversions
- [ ] DTOs with validation decorators
- [ ] Controller with proper API documentation
- [ ] Module properly configured and registered
- [ ] **All unit tests written following `src/ai-spec/unit-test-spec.md` patterns**
- [ ] **100% test coverage achieved for UseCases and Domain methods**
- [ ] All tests written and passing
- [ ] Migration created and tested
- [ ] API endpoints documented in Swagger
- [ ] Code follows project linting rules
- [ ] Error handling implemented appropriately

### Code Quality Verification

```bash
pnpm lint                    # Check code style
pnpm test                    # Run unit tests
pnpm test:cov                # Check test coverage
pnpm test:e2e                # Run integration tests
```

## Common Patterns & Best Practices

### Domain Validation

- Validate business rules in domain entities
- Use value objects for complex validation
- Throw domain-specific exceptions

### Error Handling

- Create custom exception classes
- Use proper HTTP status codes
- Log errors with appropriate levels

### Performance

- Add database indexes for frequently queried fields
- Implement caching for read-heavy operations
- Use pagination for list endpoints

### Security

- Validate all inputs with class-validator
- Implement proper authorization checks
- Sanitize output data

---

**Remember**: This template ensures consistency across all modules while maintaining the hexagonal architecture principles. Adapt the patterns to fit your specific domain requirements while keeping the core structure intact.
