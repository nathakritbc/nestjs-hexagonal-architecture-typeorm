import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { IProduct, Product, ProductId, ProductName } from '../domains/product.domain';
import { ProductRepository } from '../ports/product.repository';
import { UpdateProductByIdUseCase } from './updateProductById.usecase';

describe('UpdateProductByIdUseCase', () => {
  let updateProductByIdUseCase: UpdateProductByIdUseCase;
  const productRepository = mock<ProductRepository>();

  beforeEach(() => {
    updateProductByIdUseCase = new UpdateProductByIdUseCase(productRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const productId = faker.string.uuid() as ProductId;
  it('should be throw error when product not found', async () => {
    //Arrange
    productRepository.getById.mockResolvedValue(undefined);
    const command = mock<IProduct>({
      uuid: productId,
    });
    const errorExpected = new NotFoundException('Product not found');

    //Act
    const actual = updateProductByIdUseCase.execute(productId, command);

    //Assert
    await expect(actual).rejects.toThrow(errorExpected);
    expect(productRepository.getById).toHaveBeenCalledWith(productId);
    expect(productRepository.updateById).not.toHaveBeenCalled();
  });

  it('should be update product', async () => {
    //Arrange
    const productName = faker.commerce.productName() as ProductName;
    const resultProductUpdate = mock<IProduct>({
      uuid: productId,
      name: productName,
    });
    productRepository.getById.mockResolvedValue(resultProductUpdate);
    productRepository.updateById.mockResolvedValue(resultProductUpdate);
    const command = Builder<Product>().uuid(productId).name(productName).build();

    //Act
    const actual = await updateProductByIdUseCase.execute(productId, command);
    //Assert
    expect(actual).toEqual(resultProductUpdate);
    expect(productRepository.getById).toHaveBeenCalledWith(productId);
    expect(productRepository.updateById).toHaveBeenCalledWith(productId, command);
  });
});
