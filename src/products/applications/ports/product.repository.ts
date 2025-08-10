import { IProduct, ProductId } from '../domains/product';

export type CreateProductCommand = Omit<IProduct, 'uuid' | 'status' | 'createdAt' | 'updatedAt'>;

const productRepositoryTokenSymbol: unique symbol = Symbol('ProductRepository');
export const productRepositoryToken = productRepositoryTokenSymbol.toString();

export interface ProductRepository {
  create(product: CreateProductCommand): Promise<IProduct>;
  deleteById(id: ProductId): Promise<void>;
  getAll(): Promise<IProduct[]>;
  getById(id: ProductId): Promise<IProduct | undefined>;
  updateById(id: ProductId, product: Partial<IProduct>): Promise<IProduct>;
}
