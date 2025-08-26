import { GetAllMetaType, GetAllParamsType } from 'src/types/utility.type';
import { IProduct, ProductId } from '../domains/product.domain';

export type CreateProductCommand = Omit<IProduct, 'uuid' | 'status' | 'createdAt' | 'updatedAt'>;

export interface GetAllReturnType {
  result: IProduct[];
  meta: GetAllMetaType;
}

const productRepositoryTokenSymbol: unique symbol = Symbol('ProductRepository');
export const productRepositoryToken = productRepositoryTokenSymbol.toString();

export interface ProductRepository {
  create(product: CreateProductCommand): Promise<IProduct>;
  deleteById(id: ProductId): Promise<void>;
  getAll(params: GetAllParamsType): Promise<GetAllReturnType>;
  getById(id: ProductId): Promise<IProduct | undefined>;
  updateById(id: ProductId, product: Partial<IProduct>): Promise<IProduct>;
}
