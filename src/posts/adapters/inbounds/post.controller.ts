import { Transactional } from '@nestjs-cls/transactional';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import type { IPost, PostBody, PostId, PostTitle } from 'src/posts/applications/domains/post.domain';
import { GetAllReturnType } from 'src/posts/applications/ports/post.repository';
import { CreatePostUseCase } from 'src/posts/applications/usecases/createPost.usecase';
import { DeletePostByIdUseCase } from 'src/posts/applications/usecases/deletePostById.usecase';
import { GetAllPostsUseCase } from 'src/posts/applications/usecases/getAllPosts.usecase';
import { GetPostByIdUseCase } from 'src/posts/applications/usecases/getPostById.usecase';
import { UpdatePostByIdUseCase } from 'src/posts/applications/usecases/updatePostById.usecase';
import { CreatePostDto } from './dto/createPost.dto';
import type { UpdatePostDto } from './dto/updatePost.dto';

@ApiTags('Posts')
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly deletePostByIdUseCase: DeletePostByIdUseCase,
    private readonly getAllPostsUseCase: GetAllPostsUseCase,
    private readonly updatePostByIdUseCase: UpdatePostByIdUseCase,
    private readonly getPostByIdUseCase: GetPostByIdUseCase,
  ) {}

  @ApiOperation({ summary: 'Create a post' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The post has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Post()
  @Transactional()
  create(@Body() createPostDto: CreatePostDto): Promise<IPost> {
    const command = Builder<IPost>()
      .title(createPostDto.title as PostTitle)
      .body(createPostDto.body as PostBody)
      .build();
    return this.createPostUseCase.execute(command);
  }

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The posts have been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Get()
  @Transactional()
  getAll(
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<GetAllReturnType> {
    return this.getAllPostsUseCase.execute({
      search,
      sort,
      order,
      page,
      limit,
    });
  }

  @ApiOperation({ summary: 'Get a post by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The post has been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The post not found in the system.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @ApiParam({ name: 'id', type: String, description: 'The id of the post' })
  @Get(':id')
  @Transactional()
  getById(@Param('id', ParseUUIDPipe) id: PostId): Promise<IPost | undefined> {
    return this.getPostByIdUseCase.execute(id);
  }

  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The post has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The post not found in the system.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @ApiParam({ name: 'id', type: String, description: 'The id of the post' })
  @Put(':id')
  @Transactional()
  update(@Param('id', ParseUUIDPipe) id: PostId, @Body() updatePostDto: UpdatePostDto): Promise<IPost> {
    const command = Builder<Partial<IPost>>()
      .title(updatePostDto.title as PostTitle)
      .body(updatePostDto.body as PostBody)
      .build();
    return this.updatePostByIdUseCase.execute(id, command);
  }

  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The post has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The post not found in the system.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @ApiParam({ name: 'id', type: String, description: 'The id of the post' })
  @Delete(':id')
  @Transactional()
  delete(@Param('id', ParseUUIDPipe) id: PostId): Promise<void> {
    return this.deletePostByIdUseCase.execute(id);
  }
}
