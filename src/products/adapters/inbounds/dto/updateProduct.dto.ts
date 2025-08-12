import { IProduct } from 'src/products/applications/domains/product.domain';

export interface UpdateProductDto extends Partial<IProduct> {}
