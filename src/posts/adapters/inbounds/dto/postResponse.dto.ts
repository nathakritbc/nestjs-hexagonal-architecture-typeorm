import { ApiProperty } from '@nestjs/swagger';
import type {
  PostBody,
  PostCreatedAt,
  PostId,
  PostTitle,
  PostUpdatedAt,
} from 'src/posts/applications/domains/post.domain';

export class PostResponseDto {
  @ApiProperty({
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The unique identifier of the post',
  })
  uuid: PostId;

  @ApiProperty({
    type: String,
    example: 'My First Blog Post',
    description: 'The title of the post',
  })
  title: PostTitle;

  @ApiProperty({
    type: String,
    example: 'This is the content of my first blog post.',
    description: 'The body content of the post',
  })
  body: PostBody;

  @ApiProperty({
    type: Date,
    example: '2024-01-01T10:00:00Z',
    description: 'The date and time when the post was created',
  })
  createdAt: PostCreatedAt;

  @ApiProperty({
    type: Date,
    example: '2024-01-01T12:00:00Z',
    description: 'The date and time when the post was last updated',
  })
  updatedAt: PostUpdatedAt;
}
