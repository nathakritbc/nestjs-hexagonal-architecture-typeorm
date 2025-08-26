import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import type { IPost, PostId } from '../domains/post.domain';
import { PostRepository } from '../ports/post.repository';
import { DeletePostByIdUseCase } from './deletePostById.usecase';

describe('DeletePostByIdUseCase', () => {
  let deletePostByIdUseCase: DeletePostByIdUseCase;
  const postRepository = mock<PostRepository>();

  beforeEach(() => {
    deletePostByIdUseCase = new DeletePostByIdUseCase(postRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const postId = faker.string.uuid() as PostId;

  describe('execute', () => {
    it('should throw error when post not found', async () => {
      // Arrange
      postRepository.getById.mockResolvedValue(undefined);
      const errorExpected = new NotFoundException('Post not found');

      // Act
      const actual = deletePostByIdUseCase.execute(postId);

      // Assert
      await expect(actual).rejects.toThrow(errorExpected);
      expect(postRepository.getById).toHaveBeenCalledWith(postId);
      expect(postRepository.deleteById).not.toHaveBeenCalled();
    });

    it('should delete post successfully', async () => {
      // Arrange
      const existingPost: IPost = {
        uuid: postId,
        title: faker.lorem.sentence() as any,
        body: faker.lorem.paragraphs(2) as any,
        createdAt: faker.date.recent() as any,
        updatedAt: faker.date.recent() as any,
      };

      postRepository.getById.mockResolvedValue(existingPost);
      postRepository.deleteById.mockResolvedValue(undefined);

      // Act
      const result = await deletePostByIdUseCase.execute(postId);

      // Assert
      expect(result).toBeUndefined();
      expect(postRepository.getById).toHaveBeenCalledWith(postId);
      expect(postRepository.deleteById).toHaveBeenCalledWith(postId);
    });

    it('should handle repository error during deletion', async () => {
      // Arrange
      const existingPost: IPost = {
        uuid: postId,
        title: faker.lorem.sentence() as any,
        body: faker.lorem.paragraphs(2) as any,
        createdAt: faker.date.recent() as any,
        updatedAt: faker.date.recent() as any,
      };

      const error = new Error('Database connection failed');
      postRepository.getById.mockResolvedValue(existingPost);
      postRepository.deleteById.mockRejectedValue(error);

      // Act & Assert
      await expect(deletePostByIdUseCase.execute(postId)).rejects.toThrow(error);
      expect(postRepository.getById).toHaveBeenCalledWith(postId);
      expect(postRepository.deleteById).toHaveBeenCalledWith(postId);
    });
  });
});
