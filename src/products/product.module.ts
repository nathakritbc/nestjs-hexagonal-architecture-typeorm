import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/databases/database.module';
import { ProductController } from './adapters/inbounds/product.controller';
import { ProductTypeOrmRepository } from './adapters/outbounds/product.typeorm.repository';
import { productRepositoryToken } from './applications/ports/product.repository';
import { CreateProductUseCase } from './applications/usecases/createProduct.usecase';
import { DeleteProductByIdUseCase } from './applications/usecases/deleteProductById.usecase';
import { GetAllProductsUseCase } from './applications/usecases/getAllProducts.usecase';
import { GetProductByIdUseCase } from './applications/usecases/getProductById.usecase';
import { UpdateProductByIdUseCase } from './applications/usecases/updateProductById.usecase';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
  providers: [
    {
      provide: productRepositoryToken,
      useClass: ProductTypeOrmRepository,
    },
    CreateProductUseCase,
    DeleteProductByIdUseCase,
    GetAllProductsUseCase,
    GetProductByIdUseCase,
    UpdateProductByIdUseCase,
  ],
})
export class ProductModule {}
