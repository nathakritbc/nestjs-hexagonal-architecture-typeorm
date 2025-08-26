import { Inject, Injectable } from '@nestjs/common';
import { IPost } from '../domains/post.domain';
import type { CreatePostCommand, PostRepository } from '../ports/post.repository';
import { postRepositoryToken } from '../ports/post.repository';

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject(postRepositoryToken)
    private readonly postRepository: PostRepository,
  ) {}

  async execute(post: CreatePostCommand): Promise<IPost> {
    // Save through repository
    return await this.postRepository.create(post);
  }
}
