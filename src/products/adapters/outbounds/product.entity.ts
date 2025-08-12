import type {
  ProductCreatedAt,
  ProductDescription,
  ProductId,
  ProductImage,
  ProductName,
  ProductPrice,
  ProductUpdatedAt,
} from 'src/products/applications/domains/product.domain';
import type { Status } from 'src/types/utility.type';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export const productTableName = 'products';

@Entity({
  name: productTableName,
})
export class ProductEntity {
  @PrimaryColumn({
    type: 'uuid',
  })
  uuid: ProductId;

  @Column({
    type: 'varchar',
  })
  name: ProductName;

  @Column({
    type: 'float',
  })
  price: ProductPrice;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  description?: ProductDescription;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  image?: ProductImage;

  @Column({
    type: 'varchar',
    default: 'active',
  })
  status: Status;

  @CreateDateColumn()
  declare createdAt: ProductCreatedAt;

  @UpdateDateColumn()
  declare updatedAt: ProductUpdatedAt;
}
