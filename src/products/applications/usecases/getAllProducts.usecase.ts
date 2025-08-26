import { Inject, Injectable } from '@nestjs/common';
import type { GetAllParamsType } from 'src/types/utility.type';
import type { GetAllReturnType, ProductRepository } from '../ports/product.repository';
import { productRepositoryToken } from '../ports/product.repository';

@Injectable()
export class GetAllProductsUseCase {
  constructor(
    @Inject(productRepositoryToken)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(params: GetAllParamsType): Promise<GetAllReturnType> {
    return this.productRepository.getAll({
      search: params.search,
      sort: params.sort,
      order: params.order,
      page: params.page,
      limit: params.limit,
    });
  }
}
