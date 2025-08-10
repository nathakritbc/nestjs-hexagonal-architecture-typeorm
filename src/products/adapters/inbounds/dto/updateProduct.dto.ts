import { IProduct } from 'src/products/applications/domains/product';

export interface UpdateProductDto extends Partial<IProduct> {}
