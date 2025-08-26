import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PostId } from '../domains/post.domain';
import type { PostRepository } from '../ports/post.repository';
import { postRepositoryToken } from '../ports/post.repository';

@Injectable()
export class DeletePostByIdUseCase {
  constructor(
    @Inject(postRepositoryToken)
    private readonly postRepository: PostRepository,
  ) {}

  async execute(id: PostId): Promise<void> {
    // Step 1: Get data result by id
    const postFound = await this.postRepository.getById(id);

    // Step 2: Validate result and throw error
    if (!postFound) throw new NotFoundException('Post not found');

    // Step 3: Return delete result
    return this.postRepository.deleteById(id);
  }
}
