import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';
import { Builder, StrictBuilder } from 'builder-pattern';
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
import {
  CreateProductCommand,
  GetAllReturnType,
  ProductRepository,
} from 'src/products/applications/ports/product.repository';
import { GetAllMetaType, GetAllParamsType, type Status } from 'src/types/utility.type';
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

  async getAll(params: GetAllParamsType): Promise<GetAllReturnType> {
    const { search, sort, order, page, limit } = params;

    const currentPage = page ?? 1;
    const currentLimit = limit ?? 10;

    const queryBuilder = this.productModel.tx.getRepository(ProductEntity).createQueryBuilder('product');

    if (search) {
      queryBuilder.where('product.name LIKE :search', { search: `%${search}%` });
    }

    const sortableColumns = ['name', 'price', 'createdAt'];
    if (sort && sortableColumns.includes(sort)) {
      queryBuilder.orderBy(`product.${sort}`, order === 'ASC' ? 'ASC' : 'DESC');
    }

    if (currentLimit !== -1) {
      queryBuilder.skip((currentPage - 1) * currentLimit).take(currentLimit);
    }

    const [products, count] = await queryBuilder.getManyAndCount();

    const result = products.map((product) => ProductTypeOrmRepository.toDomain(product));

    const meta = StrictBuilder<GetAllMetaType>().page(currentPage).limit(currentLimit).total(count).build();

    return StrictBuilder<GetAllReturnType>().result(result).meta(meta).build();
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
