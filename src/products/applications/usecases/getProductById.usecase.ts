import { Inject, Injectable } from '@nestjs/common';
import { IProduct, ProductId } from '../domains/product.domain';
import type { ProductRepository } from '../ports/product.repository';
import { productRepositoryToken } from '../ports/product.repository';

@Injectable()
export class GetProductByIdUseCase {
  constructor(
    @Inject(productRepositoryToken)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: ProductId): Promise<IProduct | undefined> {
    return this.productRepository.getById(id);
  }
}
