import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import type {
  ProductDescription,
  ProductImage,
  ProductName,
  ProductPrice,
} from 'src/products/applications/domains/product';

export class CreateProductDto {
  @ApiProperty({
    type: String,
    example: 'John Doe',
    description: 'The name of the product in multiple languages',
  })
  @IsNotEmpty()
  name: ProductName;

  @ApiProperty({
    type: Number,
    example: 100.75,
    description: 'The price of the product',
  })
  @IsNotEmpty()
  price: ProductPrice;

  @ApiProperty({
    type: String,
    example: 'https://example.com/avatar.jpg',
    description: 'The image of the product',
  })
  @IsOptional()
  image?: ProductImage;

  @ApiProperty({
    type: String,
    example: 'This is a product description',
    description: 'The description of the product',
  })
  @IsOptional()
  description: ProductDescription;
}
