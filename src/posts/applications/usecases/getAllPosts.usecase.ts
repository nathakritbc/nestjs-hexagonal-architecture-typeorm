import { Inject, Injectable } from '@nestjs/common';
import type { GetAllParamsType } from 'src/types/utility.type';
import type { GetAllReturnType, PostRepository } from '../ports/post.repository';
import { postRepositoryToken } from '../ports/post.repository';

@Injectable()
export class GetAllPostsUseCase {
  constructor(
    @Inject(postRepositoryToken)
    private readonly postRepository: PostRepository,
  ) {}

  async execute(params: GetAllParamsType): Promise<GetAllReturnType> {
    return this.postRepository.getAll({
      search: params.search,
      sort: params.sort,
      order: params.order,
      page: params.page,
      limit: params.limit,
    });
  }
}
