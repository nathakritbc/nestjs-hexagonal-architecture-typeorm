import { Transactional } from '@nestjs-cls/transactional';
import { Body, Controller, Delete, Get, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import type { IProduct, ProductDescription, ProductId, ProductName } from 'src/products/applications/domains/product';
import { ProductImage, ProductPrice } from 'src/products/applications/domains/product';
import { CreateProductUseCase } from 'src/products/applications/usecases/createProduct.usecase';
import { DeleteProductByIdUseCase } from 'src/products/applications/usecases/deleteProductById.usecase';
import { GetAllProductsUseCase } from 'src/products/applications/usecases/getAllProducts.usecase';
import { GetProductByIdUseCase } from 'src/products/applications/usecases/getProductById.usecase';
import { UpdateProductByIdUseCase } from 'src/products/applications/usecases/updateProductById.usecase';
import { Status } from 'src/types/utility.type';
import { CreateProductDto } from './dto/createProduct.dto';
import type { UpdateProductDto } from './dto/updateProduct.dto';

// @UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly deleteProductByIdUseCase: DeleteProductByIdUseCase,
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    private readonly updateProductByIdUseCase: UpdateProductByIdUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
  ) {}

  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The product has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Post()
  @Transactional()
  create(@Body() createProductDto: CreateProductDto): Promise<IProduct> {
    const command = Builder<IProduct>()
      .name(createProductDto.name as ProductName)
      .price(createProductDto.price as ProductPrice)
      .image(createProductDto.image as ProductImage)
      .description(createProductDto.description as ProductDescription)
      .build();
    return this.createProductUseCase.execute(command);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The products have been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Transactional()
  @Get()
  getAll(): Promise<IProduct[]> {
    return this.getAllProductsUseCase.execute();
  }

  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The product has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The product not found in the system.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Transactional()
  @ApiParam({ name: 'id', type: String, description: 'The id of the product' })
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: ProductId): Promise<void> {
    return this.deleteProductByIdUseCase.execute(id);
  }

  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The product has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The product not found in the system.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @ApiParam({ name: 'id', type: String, description: 'The id of the product' })
  @Transactional()
  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: ProductId, @Body() updateProductDto: UpdateProductDto): Promise<IProduct> {
    const command = Builder<IProduct>()
      .name(updateProductDto.name as ProductName)
      .price(updateProductDto.price as ProductPrice)
      .image(updateProductDto.image as ProductImage)
      .description(updateProductDto.description as ProductDescription)
      .status(updateProductDto.status as Status)
      .build();
    return this.updateProductByIdUseCase.execute(id, command);
  }

  @ApiOperation({ summary: 'Get a product by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The product has been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @ApiParam({ name: 'id', type: String, description: 'The id of the product' })
  @Transactional()
  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: ProductId): Promise<IProduct | undefined> {
    return this.getProductByIdUseCase.execute(id);
  }
}
