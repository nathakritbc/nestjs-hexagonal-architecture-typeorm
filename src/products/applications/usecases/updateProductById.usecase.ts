import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProduct, ProductId } from '../domains/product.domain';
import type { ProductRepository } from '../ports/product.repository';
import { productRepositoryToken } from '../ports/product.repository';

@Injectable()
export class UpdateProductByIdUseCase {
  constructor(
    @Inject(productRepositoryToken)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: ProductId, product: Partial<IProduct>): Promise<IProduct> {
    const productFound = await this.productRepository.getById(id);

    if (!productFound) throw new NotFoundException('Product not found');
    return this.productRepository.updateById(id, product);
  }
}
