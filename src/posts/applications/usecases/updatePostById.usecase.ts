import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IPost, PostId } from '../domains/post.domain';
import type { PostRepository } from '../ports/post.repository';
import { postRepositoryToken } from '../ports/post.repository';

@Injectable()
export class UpdatePostByIdUseCase {
  constructor(
    @Inject(postRepositoryToken)
    private readonly postRepository: PostRepository,
  ) {}

  async execute(id: PostId, post: Partial<IPost>): Promise<IPost> {
    // Step 1: Check if post exists
    const existingPost = await this.postRepository.getById(id);

    // Step 2: Validate result and throw error if not found
    if (!existingPost) {
      throw new NotFoundException('Post not found');
    }

    // Step 3: Update and return the post
    return this.postRepository.updateById(id, post);
  }
}
