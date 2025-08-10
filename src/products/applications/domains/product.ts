import { Brand, CreatedAt, Status, UpdatedAt } from 'src/types/utility.type';

export type ProductId = Brand<string, 'ProductId'>;
export type ProductName = Brand<string, 'ProductName'>;
export type ProductPrice = Brand<number, 'ProductPrice'>;
export type ProductDescription = Brand<string, 'ProductDescription'>;
export type ProductImage = Brand<string, 'ProductImage'>;
export type ProductCreatedAt = Brand<CreatedAt, 'ProductCreatedAt'>;
export type ProductUpdatedAt = Brand<UpdatedAt, 'ProductUpdatedAt'>;

export interface IProduct {
  uuid: ProductId;
  name: ProductName;
  price: ProductPrice;
  description?: ProductDescription;
  status: Status;
  image?: ProductImage;
  createdAt?: ProductCreatedAt;
  updatedAt?: ProductUpdatedAt;
}

export class Product implements IProduct {
  uuid: ProductId;
  name: ProductName;
  price: ProductPrice;
  description?: ProductDescription;
  status: Status;
  image?: ProductImage;
  createdAt?: ProductCreatedAt;
  updatedAt?: ProductUpdatedAt;
}
