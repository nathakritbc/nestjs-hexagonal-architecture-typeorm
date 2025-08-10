import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { IProduct, ProductId } from '../domains/product';
import { ProductRepository } from '../ports/product.repository';
import { DeleteProductByIdUseCase } from './deleteProductById.usecase';

describe('DeleteProductByIdUseCase', () => {
  let deleteProductByIdUseCase: DeleteProductByIdUseCase;
  const productRepository = mock<ProductRepository>();

  beforeEach(() => {
    deleteProductByIdUseCase = new DeleteProductByIdUseCase(productRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const productId = faker.string.uuid() as ProductId;
  it('should be throw error when product not found', async () => {
    //Arrange
    productRepository.getById.mockResolvedValue(undefined);
    const errorExpected = new NotFoundException('Product not found');

    //Act
    const actual = deleteProductByIdUseCase.execute(productId);

    //Assert
    await expect(actual).rejects.toThrow(errorExpected);
    expect(productRepository.getById).toHaveBeenCalledWith(productId);
    expect(productRepository.deleteById).not.toHaveBeenCalled();
  });

  it('should be delete product', async () => {
    //Arrange
    productRepository.getById.mockResolvedValue(mock<IProduct>({ uuid: productId }));
    productRepository.deleteById.mockResolvedValue(undefined);

    //Act
    const actual = await deleteProductByIdUseCase.execute(productId);
    //Assert
    expect(actual).toBeUndefined();
    expect(productRepository.getById).toHaveBeenCalledWith(productId);
    expect(productRepository.deleteById).toHaveBeenCalledWith(productId);
  });
});
