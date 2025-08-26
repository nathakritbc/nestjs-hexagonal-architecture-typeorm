import { Inject, Injectable } from '@nestjs/common';
import type { IPost, PostId } from '../domains/post.domain';
import type { PostRepository } from '../ports/post.repository';
import { postRepositoryToken } from '../ports/post.repository';

@Injectable()
export class GetPostByIdUseCase {
  constructor(
    @Inject(postRepositoryToken)
    private readonly postRepository: PostRepository,
  ) {}

  async execute(id: PostId): Promise<IPost | undefined> {
    return this.postRepository.getById(id);
  }
}
