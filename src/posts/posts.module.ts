import { Module } from '@nestjs/common';

// Controllers
import { PostController } from './adapters/inbounds/post.controller';

// Use Cases
import { CreatePostUseCase } from './applications/usecases/createPost.usecase';
import { DeletePostByIdUseCase } from './applications/usecases/deletePostById.usecase';
import { GetAllPostsUseCase } from './applications/usecases/getAllPosts.usecase';
import { GetPostByIdUseCase } from './applications/usecases/getPostById.usecase';
import { UpdatePostByIdUseCase } from './applications/usecases/updatePostById.usecase';

// Repository Implementation
import { PostTypeOrmRepository } from './adapters/outbounds/post.typeorm.repository';
import { postRepositoryToken } from './applications/ports/post.repository';

@Module({
  imports: [],
  controllers: [PostController],
  providers: [
    // Repository binding
    {
      provide: postRepositoryToken,
      useClass: PostTypeOrmRepository,
    },
    // Use Cases
    CreatePostUseCase,
    DeletePostByIdUseCase,
    GetAllPostsUseCase,
    GetPostByIdUseCase,
    UpdatePostByIdUseCase,
  ],
  exports: [
    // Export use cases if needed by other modules
    CreatePostUseCase,
    DeletePostByIdUseCase,
    GetAllPostsUseCase,
    GetPostByIdUseCase,
    UpdatePostByIdUseCase,
  ],
})
export class PostsModule {}
