import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductId } from '../domains/product';
import type { ProductRepository } from '../ports/product.repository';
import { productRepositoryToken } from '../ports/product.repository';

@Injectable()
export class DeleteProductByIdUseCase {
  constructor(
    @Inject(productRepositoryToken)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: ProductId): Promise<void> {
    const productFound = await this.productRepository.getById(id);

    if (!productFound) throw new NotFoundException('Product not found');
    return this.productRepository.deleteById(id);
  }
}
