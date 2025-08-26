import { faker } from '@faker-js/faker';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import type { IPost, PostBody, PostTitle } from '../domains/post.domain';
import { CreatePostCommand, PostRepository } from '../ports/post.repository';
import { CreatePostUseCase } from './createPost.usecase';

describe('CreatePostUseCase', () => {
  let createPostUseCase: CreatePostUseCase;
  const postRepository = mock<PostRepository>();

  beforeEach(() => {
    createPostUseCase = new CreatePostUseCase(postRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('execute', () => {
    it('should create a new post successfully', async () => {
      // Arrange
      const createPostCommand: CreatePostCommand = {
        title: faker.lorem.sentence() as PostTitle,
        body: faker.lorem.paragraphs(2) as PostBody,
      };

      const expectedPost: IPost = {
        uuid: faker.string.uuid() as any,
        title: createPostCommand.title,
        body: createPostCommand.body,
        createdAt: faker.date.recent() as any,
        updatedAt: faker.date.recent() as any,
      };

      postRepository.create.mockResolvedValue(expectedPost);

      // Act
      const result = await createPostUseCase.execute(createPostCommand);

      // Assert
      expect(result).toEqual(expectedPost);
      expect(postRepository.create).toHaveBeenCalledWith(createPostCommand);
      expect(postRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw error when repository fails to create post', async () => {
      // Arrange
      const createPostCommand: CreatePostCommand = {
        title: faker.lorem.sentence() as PostTitle,
        body: faker.lorem.paragraphs(2) as PostBody,
      };

      const error = new Error('Database connection failed');
      postRepository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(createPostUseCase.execute(createPostCommand)).rejects.toThrow(error);
      expect(postRepository.create).toHaveBeenCalledWith(createPostCommand);
      expect(postRepository.create).toHaveBeenCalledTimes(1);
    });
  });
});
