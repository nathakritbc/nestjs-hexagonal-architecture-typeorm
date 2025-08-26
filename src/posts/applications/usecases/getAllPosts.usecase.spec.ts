import { faker } from '@faker-js/faker';
import type { GetAllParamsType } from 'src/types/utility.type';
import { vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import type { IPost } from '../domains/post.domain';
import { GetAllReturnType, PostRepository } from '../ports/post.repository';
import { GetAllPostsUseCase } from './getAllPosts.usecase';

describe('GetAllPostsUseCase', () => {
  let getAllPostsUseCase: GetAllPostsUseCase;
  const postRepository = mock<PostRepository>();

  beforeEach(() => {
    getAllPostsUseCase = new GetAllPostsUseCase(postRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('execute', () => {
    it('should return paginated posts successfully', async () => {
      // Arrange
      const params: GetAllParamsType = {
        search: faker.lorem.word(),
        sort: 'title',
        order: 'ASC',
        page: 1,
        limit: 10,
      };

      const mockPosts: IPost[] = [
        {
          uuid: faker.string.uuid() as any,
          title: faker.lorem.sentence() as any,
          body: faker.lorem.paragraphs(2) as any,
          createdAt: faker.date.recent() as any,
          updatedAt: faker.date.recent() as any,
        },
        {
          uuid: faker.string.uuid() as any,
          title: faker.lorem.sentence() as any,
          body: faker.lorem.paragraphs(2) as any,
          createdAt: faker.date.recent() as any,
          updatedAt: faker.date.recent() as any,
        },
      ];

      const expectedResult: GetAllReturnType = {
        result: mockPosts,
        meta: {
          page: 1,
          limit: 10,
          total: 2,
        },
      };

      postRepository.getAll.mockResolvedValue(expectedResult);

      // Act
      const result = await getAllPostsUseCase.execute(params);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(postRepository.getAll).toHaveBeenCalledWith(params);
      expect(postRepository.getAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty result when no posts found', async () => {
      // Arrange
      const params: GetAllParamsType = {
        page: 1,
        limit: 10,
      };

      const expectedResult: GetAllReturnType = {
        result: [],
        meta: {
          page: 1,
          limit: 10,
          total: 0,
        },
      };

      postRepository.getAll.mockResolvedValue(expectedResult);

      // Act
      const result = await getAllPostsUseCase.execute(params);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(result.result).toHaveLength(0);
      expect(postRepository.getAll).toHaveBeenCalledWith(params);
    });

    it('should handle repository error', async () => {
      // Arrange
      const params: GetAllParamsType = {
        page: 1,
        limit: 10,
      };

      const error = new Error('Database connection failed');
      postRepository.getAll.mockRejectedValue(error);

      // Act & Assert
      await expect(getAllPostsUseCase.execute(params)).rejects.toThrow(error);
      expect(postRepository.getAll).toHaveBeenCalledWith(params);
    });

    it('should handle different pagination parameters', async () => {
      // Arrange
      const params: GetAllParamsType = {
        page: 2,
        limit: 5,
        search: 'test',
        sort: 'createdAt',
        order: 'DESC',
      };

      const expectedResult: GetAllReturnType = {
        result: [],
        meta: {
          page: 2,
          limit: 5,
          total: 0,
        },
      };

      postRepository.getAll.mockResolvedValue(expectedResult);

      // Act
      const result = await getAllPostsUseCase.execute(params);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(postRepository.getAll).toHaveBeenCalledWith(params);
    });
  });
});
