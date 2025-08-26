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

```
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

## Implementation Steps

### Step 1: Domain Layer (Core Business Logic)
Create the domain entity first as it represents the core business concept.

#### Domain Entity Template (`{ENTITY_NAME}.domain.ts`)
```typescript
import { Builder } from 'builder-pattern';

export interface {ENTITY_NAME}Props {
  id?: string;
  // Add your domain properties here
  createdAt?: Date;
  updatedAt?: Date;
}

export class {ENTITY_NAME}Domain {
  private props: {ENTITY_NAME}Props;

  constructor(props: {ENTITY_NAME}Props) {
    this.props = props;
  }

  // Getters
  get id(): string | undefined {
    return this.props.id;
  }

  // Add other getters and business methods here

  // Business logic methods
  // Example: validate(), canBeDeleted(), etc.

  // Static factory method
  static create(props: {ENTITY_NAME}Props): {ENTITY_NAME}Domain {
    return Builder<{ENTITY_NAME}Domain>()
      .id(props.id)
      // Set other properties
      .build();
  }

  // Convert to plain object
  toPlainObject(): {ENTITY_NAME}Props {
    return { ...this.props };
  }
}
```

#### Domain Test Template (`{ENTITY_NAME}.domain.spec.ts`)
```typescript
import { describe, it, expect } from 'vitest';
import { {ENTITY_NAME}Domain } from './{ENTITY_NAME}.domain';

describe('{ENTITY_NAME}Domain', () => {
  describe('create', () => {
    it('should create a {ENTITY_NAME} domain object', () => {
      // Test implementation
    });

    it('should validate required properties', () => {
      // Test validation logic
    });
  });

  describe('business logic methods', () => {
    // Test business logic methods
  });
});
```

### Step 2: Port Layer (Repository Interface)

#### Repository Interface Template (`{ENTITY_NAME}.repository.ts`)
```typescript
import { {ENTITY_NAME}Domain } from '../domains/{ENTITY_NAME}.domain';

export abstract class {ENTITY_NAME}Repository {
  abstract create(entity: {ENTITY_NAME}Domain): Promise<{ENTITY_NAME}Domain>;
  abstract findById(id: string): Promise<{ENTITY_NAME}Domain | null>;
  abstract findAll(page?: number, limit?: number): Promise<{ENTITY_NAME}Domain[]>;
  abstract update(id: string, entity: Partial<{ENTITY_NAME}Domain>): Promise<{ENTITY_NAME}Domain>;
  abstract delete(id: string): Promise<void>;
  
  // Add custom query methods as needed
  // abstract findBySpecificCriteria(criteria: any): Promise<{ENTITY_NAME}Domain[]>;
}
```

### Step 3: Use Cases Layer

#### Use Case Template (`create{ENTITY_NAME}.usecase.ts`)
```typescript
import { Injectable } from '@nestjs/common';
import { {ENTITY_NAME}Domain } from '../domains/{ENTITY_NAME}.domain';
import { {ENTITY_NAME}Repository } from '../ports/{ENTITY_NAME}.repository';

export interface Create{ENTITY_NAME}Data {
  // Define input data structure
}

@Injectable()
export class Create{ENTITY_NAME}UseCase {
  constructor(private readonly {ENTITY_NAME}Repository: {ENTITY_NAME}Repository) {}

  async execute(data: Create{ENTITY_NAME}Data): Promise<{ENTITY_NAME}Domain> {
    // 1. Validate input data
    // 2. Create domain entity
    const {ENTITY_NAME} = {ENTITY_NAME}Domain.create({
      // Map data to domain props
    });

    // 3. Apply business rules
    // 4. Save through repository
    return await this.{ENTITY_NAME}Repository.create({ENTITY_NAME});
  }
}
```

#### Use Case Test Template (`create{ENTITY_NAME}.usecase.spec.ts`)
```typescript
import { Test } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Create{ENTITY_NAME}UseCase } from './create{ENTITY_NAME}.usecase';
import { {ENTITY_NAME}Repository } from '../ports/{ENTITY_NAME}.repository';

describe('Create{ENTITY_NAME}UseCase', () => {
  let useCase: Create{ENTITY_NAME}UseCase;
  let repository: {ENTITY_NAME}Repository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        Create{ENTITY_NAME}UseCase,
        {
          provide: {ENTITY_NAME}Repository,
          useValue: {
            create: vi.fn(),
            // Mock other methods
          },
        },
      ],
    }).compile();

    useCase = module.get<Create{ENTITY_NAME}UseCase>(Create{ENTITY_NAME}UseCase);
    repository = module.get<{ENTITY_NAME}Repository>({ENTITY_NAME}Repository);
  });

  describe('execute', () => {
    it('should create a new {ENTITY_NAME}', async () => {
      // Test implementation
    });

    it('should handle validation errors', async () => {
      // Test error scenarios
    });
  });
});
```

### Step 4: Outbound Adapters (Database Layer)

#### TypeORM Entity Template (`{ENTITY_NAME}.entity.ts`)
```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('{ENTITY_NAME}s') // Usually plural table name
export class {ENTITY_NAME}Entity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Add your entity columns here
  // @Column()
  // name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### Repository Implementation Template (`{ENTITY_NAME}.typeorm.repository.ts`)
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { {ENTITY_NAME}Domain } from '../../applications/domains/{ENTITY_NAME}.domain';
import { {ENTITY_NAME}Repository } from '../../applications/ports/{ENTITY_NAME}.repository';
import { {ENTITY_NAME}Entity } from './{ENTITY_NAME}.entity';

@Injectable()
export class {ENTITY_NAME}TypeormRepository extends {ENTITY_NAME}Repository {
  constructor(
    @InjectRepository({ENTITY_NAME}Entity)
    private readonly repository: Repository<{ENTITY_NAME}Entity>,
  ) {
    super();
  }

  async create(domain: {ENTITY_NAME}Domain): Promise<{ENTITY_NAME}Domain> {
    const entity = this.domainToEntity(domain);
    const saved = await this.repository.save(entity);
    return this.entityToDomain(saved);
  }

  async findById(id: string): Promise<{ENTITY_NAME}Domain | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.entityToDomain(entity) : null;
  }

  async findAll(page = 1, limit = 10): Promise<{ENTITY_NAME}Domain[]> {
    const entities = await this.repository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async update(id: string, domain: Partial<{ENTITY_NAME}Domain>): Promise<{ENTITY_NAME}Domain> {
    await this.repository.update(id, this.domainToEntity(domain));
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) throw new Error('{ENTITY_NAME} not found');
    return this.entityToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private entityToDomain(entity: {ENTITY_NAME}Entity): {ENTITY_NAME}Domain {
    return {ENTITY_NAME}Domain.create({
      id: entity.id,
      // Map entity properties to domain properties
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private domainToEntity(domain: Partial<{ENTITY_NAME}Domain>): Partial<{ENTITY_NAME}Entity> {
    const props = domain.toPlainObject ? domain.toPlainObject() : domain;
    return {
      id: props.id,
      // Map domain properties to entity properties
    };
  }
}
```

### Step 5: Inbound Adapters (API Layer)

#### DTO Templates

**Create DTO** (`create{ENTITY_NAME}.dto.ts`)
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class Create{ENTITY_NAME}Dto {
  @ApiProperty({ example: 'Example value', description: 'Description of field' })
  @IsNotEmpty()
  @IsString()
  name: string;

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

export class {ENTITY_NAME}ResponseDto {
  @ApiProperty()
  id: string;

  // Add response properties matching domain

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
```

#### Controller Template (`{ENTITY_NAME}.controller.ts`)
```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Create{ENTITY_NAME}UseCase } from '../applications/usecases/create{ENTITY_NAME}.usecase';
import { Get{ENTITY_NAME}ByIdUseCase } from '../applications/usecases/get{ENTITY_NAME}ById.usecase';
// Import other use cases
import { Create{ENTITY_NAME}Dto } from './create{ENTITY_NAME}.dto';
import { Update{ENTITY_NAME}Dto } from './update{ENTITY_NAME}.dto';
import { {ENTITY_NAME}ResponseDto } from './{ENTITY_NAME}Response.dto';

@Controller('{MODULE_NAME}')
@ApiTags('{ENTITY_NAME}s')
@ApiBearerAuth()
export class {ENTITY_NAME}Controller {
  constructor(
    private readonly create{ENTITY_NAME}UseCase: Create{ENTITY_NAME}UseCase,
    private readonly get{ENTITY_NAME}ByIdUseCase: Get{ENTITY_NAME}ByIdUseCase,
    // Inject other use cases
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new {ENTITY_NAME}' })
  @ApiResponse({
    status: 201,
    description: '{ENTITY_NAME} created successfully',
    type: {ENTITY_NAME}ResponseDto,
  })
  async create(@Body() dto: Create{ENTITY_NAME}Dto): Promise<{ENTITY_NAME}ResponseDto> {
    const domain = await this.create{ENTITY_NAME}UseCase.execute(dto);
    return this.domainToResponse(domain);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get {ENTITY_NAME} by ID' })
  @ApiResponse({
    status: 200,
    description: '{ENTITY_NAME} found',
    type: {ENTITY_NAME}ResponseDto,
  })
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<{ENTITY_NAME}ResponseDto> {
    const domain = await this.get{ENTITY_NAME}ByIdUseCase.execute(id);
    return this.domainToResponse(domain);
  }

  @Get()
  @ApiOperation({ summary: 'Get all {ENTITY_NAME}s' })
  async getAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ): Promise<{ENTITY_NAME}ResponseDto[]> {
    // Implement list use case
    return [];
  }

  // Add other CRUD operations

  private domainToResponse(domain: any): {ENTITY_NAME}ResponseDto {
    return {
      id: domain.id,
      // Map domain properties to response DTO
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}
```

### Step 6: Module Configuration

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
  imports: [TypeOrmModule.forFeature([{ENTITY_NAME}Entity])],
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

### Test Coverage Requirements
- [ ] Domain entity tests (business logic)
- [ ] Use case tests (application logic)
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
