import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import {
  IProduct,
  Product,
  ProductCreatedAt,
  ProductDescription,
  ProductId,
  ProductImage,
  ProductName,
  ProductPrice,
  ProductUpdatedAt,
} from 'src/products/applications/domains/product.domain';
import { CreateProductCommand, ProductRepository } from 'src/products/applications/ports/product.repository';
import type { Status } from 'src/types/utility.type';
import { v4 as uuidv4 } from 'uuid';
import { ProductEntity } from './product.entity';
@Injectable()
export class ProductTypeOrmRepository implements ProductRepository {
  constructor(private readonly productModel: TransactionHost<TransactionalAdapterTypeOrm>) {}

  async create(product: CreateProductCommand): Promise<IProduct> {
    const uuid = uuidv4() as ProductId;
    const resultCreated = await this.productModel.tx.getRepository(ProductEntity).save({
      uuid: uuid,
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
    });
    return ProductTypeOrmRepository.toDomain(resultCreated as ProductEntity);
  }

  async deleteById(id: ProductId): Promise<void> {
    await this.productModel.tx.getRepository(ProductEntity).delete({ uuid: id });
  }

  async getAll(): Promise<IProduct[]> {
    const products = await this.productModel.tx.getRepository(ProductEntity).find({
      order: {
        createdAt: 'DESC',
      } as any,
    });
    return products ? products.map((product) => ProductTypeOrmRepository.toDomain(product)) : [];
  }

  async getById(id: ProductId): Promise<IProduct | undefined> {
    const product = await this.productModel.tx.getRepository(ProductEntity).findOne({
      where: {
        uuid: id,
      },
    });
    return product ? ProductTypeOrmRepository.toDomain(product) : undefined;
  }

  async updateById(id: ProductId, product: Partial<IProduct>): Promise<IProduct> {
    await this.productModel.tx.getRepository(ProductEntity).update({ uuid: id }, product);
    const updatedProduct = await this.productModel.tx.getRepository(ProductEntity).findOne({
      where: {
        uuid: id,
      },
    });
    return ProductTypeOrmRepository.toDomain(updatedProduct as ProductEntity);
  }

  public static toDomain(productEntity: ProductEntity): IProduct {
    return Builder(Product)
      .uuid(productEntity.uuid as ProductId)
      .name(productEntity.name as ProductName)
      .price(productEntity.price as ProductPrice)
      .description(productEntity.description as ProductDescription)
      .image(productEntity.image as ProductImage)
      .status(productEntity.status as Status)
      .createdAt(productEntity.createdAt as ProductCreatedAt)
      .updatedAt(productEntity.updatedAt as ProductUpdatedAt)
      .build();
  }
}
