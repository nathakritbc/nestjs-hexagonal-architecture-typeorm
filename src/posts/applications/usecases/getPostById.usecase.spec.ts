import { faker } from '@faker-js/faker';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import type { IPost, PostId } from '../domains/post.domain';
import { PostRepository } from '../ports/post.repository';
import { GetPostByIdUseCase } from './getPostById.usecase';

describe('GetPostByIdUseCase', () => {
  let getPostByIdUseCase: GetPostByIdUseCase;
  const postRepository = mock<PostRepository>();

  beforeEach(() => {
    getPostByIdUseCase = new GetPostByIdUseCase(postRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const postId = faker.string.uuid() as PostId;

  describe('execute', () => {
    it('should return post when found', async () => {
      // Arrange
      const expectedPost: IPost = {
        uuid: postId,
        title: faker.lorem.sentence() as any,
        body: faker.lorem.paragraphs(2) as any,
        createdAt: faker.date.recent() as any,
        updatedAt: faker.date.recent() as any,
      };

      postRepository.getById.mockResolvedValue(expectedPost);

      // Act
      const result = await getPostByIdUseCase.execute(postId);

      // Assert
      expect(result).toEqual(expectedPost);
      expect(postRepository.getById).toHaveBeenCalledWith(postId);
      expect(postRepository.getById).toHaveBeenCalledTimes(1);
    });

    it('should return undefined when post not found', async () => {
      // Arrange
      postRepository.getById.mockResolvedValue(undefined);

      // Act
      const result = await getPostByIdUseCase.execute(postId);

      // Assert
      expect(result).toBeUndefined();
      expect(postRepository.getById).toHaveBeenCalledWith(postId);
      expect(postRepository.getById).toHaveBeenCalledTimes(1);
    });

    it('should handle repository error', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      postRepository.getById.mockRejectedValue(error);

      // Act & Assert
      await expect(getPostByIdUseCase.execute(postId)).rejects.toThrow(error);
      expect(postRepository.getById).toHaveBeenCalledWith(postId);
      expect(postRepository.getById).toHaveBeenCalledTimes(1);
    });
  });
});
