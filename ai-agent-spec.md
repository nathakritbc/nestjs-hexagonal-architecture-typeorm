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

### Repository Implementation Pattern
```typescript
// Port (Interface)
export abstract class UserRepository {
  abstract create(user: UserDomain): Promise<UserDomain>;
  abstract findById(id: string): Promise<UserDomain | null>;
}

// Adapter (Implementation)
@Injectable()
export class UserTypeormRepository extends UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {
    super();
  }
  
  async create(user: UserDomain): Promise<UserDomain> {
    // Implementation
  }
}
```

### Use Case Pattern
```typescript
@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  
  async execute(data: CreateUserData): Promise<UserDomain> {
    // Business logic
  }
}
```

### Controller Pattern
```typescript
@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}
  
  @Post()
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    // Delegate to use case
  }
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
