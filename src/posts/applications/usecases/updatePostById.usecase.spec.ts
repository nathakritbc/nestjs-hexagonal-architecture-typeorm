import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import type { IPost, PostBody, PostId, PostTitle } from '../domains/post.domain';
import { PostRepository } from '../ports/post.repository';
import { UpdatePostByIdUseCase } from './updatePostById.usecase';

describe('UpdatePostByIdUseCase', () => {
  let updatePostByIdUseCase: UpdatePostByIdUseCase;
  const postRepository = mock<PostRepository>();

  beforeEach(() => {
    updatePostByIdUseCase = new UpdatePostByIdUseCase(postRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const postId = faker.string.uuid() as PostId;

  describe('execute', () => {
    it('should throw error when post not found', async () => {
      // Arrange
      const updateData: Partial<IPost> = {
        title: faker.lorem.sentence() as PostTitle,
        body: faker.lorem.paragraphs(2) as PostBody,
      };

      postRepository.getById.mockResolvedValue(undefined);
      const errorExpected = new NotFoundException('Post not found');

      // Act
      const actual = updatePostByIdUseCase.execute(postId, updateData);

      // Assert
      await expect(actual).rejects.toThrow(errorExpected);
      expect(postRepository.getById).toHaveBeenCalledWith(postId);
      expect(postRepository.updateById).not.toHaveBeenCalled();
    });

    it('should update post successfully when post exists', async () => {
      // Arrange
      const existingPost: IPost = {
        uuid: postId,
        title: faker.lorem.sentence() as PostTitle,
        body: faker.lorem.paragraphs(2) as PostBody,
        createdAt: faker.date.recent() as any,
        updatedAt: faker.date.recent() as any,
      };

      const updateData: Partial<IPost> = {
        title: faker.lorem.sentence() as PostTitle,
        body: faker.lorem.paragraphs(2) as PostBody,
      };

      const updatedPost: IPost = {
        ...existingPost,
        ...updateData,
        updatedAt: faker.date.recent() as any,
      };

      postRepository.getById.mockResolvedValue(existingPost);
      postRepository.updateById.mockResolvedValue(updatedPost);

      // Act
      const result = await updatePostByIdUseCase.execute(postId, updateData);

      // Assert
      expect(result).toEqual(updatedPost);
      expect(postRepository.getById).toHaveBeenCalledWith(postId);
      expect(postRepository.updateById).toHaveBeenCalledWith(postId, updateData);
    });

    it('should update partial data successfully', async () => {
      // Arrange
      const existingPost: IPost = {
        uuid: postId,
        title: faker.lorem.sentence() as PostTitle,
        body: faker.lorem.paragraphs(2) as PostBody,
        createdAt: faker.date.recent() as any,
        updatedAt: faker.date.recent() as any,
      };

      const updateData: Partial<IPost> = {
        title: faker.lorem.sentence() as PostTitle,
        // Only updating title, not body
      };

      const updatedPost: IPost = {
        ...existingPost,
        ...updateData,
        updatedAt: faker.date.recent() as any,
      };

      postRepository.getById.mockResolvedValue(existingPost);
      postRepository.updateById.mockResolvedValue(updatedPost);

      // Act
      const result = await updatePostByIdUseCase.execute(postId, updateData);

      // Assert
      expect(result).toEqual(updatedPost);
      expect(result.title).toEqual(updateData.title);
      expect(postRepository.getById).toHaveBeenCalledWith(postId);
      expect(postRepository.updateById).toHaveBeenCalledWith(postId, updateData);
    });

    it('should handle repository error during update', async () => {
      // Arrange
      const existingPost: IPost = {
        uuid: postId,
        title: faker.lorem.sentence() as PostTitle,
        body: faker.lorem.paragraphs(2) as PostBody,
        createdAt: faker.date.recent() as any,
        updatedAt: faker.date.recent() as any,
      };

      const updateData: Partial<IPost> = {
        title: faker.lorem.sentence() as PostTitle,
      };

      const error = new Error('Database connection failed');
      postRepository.getById.mockResolvedValue(existingPost);
      postRepository.updateById.mockRejectedValue(error);

      // Act & Assert
      await expect(updatePostByIdUseCase.execute(postId, updateData)).rejects.toThrow(error);
      expect(postRepository.getById).toHaveBeenCalledWith(postId);
      expect(postRepository.updateById).toHaveBeenCalledWith(postId, updateData);
    });
  });
});
