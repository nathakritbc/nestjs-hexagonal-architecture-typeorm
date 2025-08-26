import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import type { PostBody, PostTitle } from 'src/posts/applications/domains/post.domain';

export class CreatePostDto {
  @ApiProperty({
    type: String,
    example: 'My First Blog Post',
    description: 'The title of the post',
  })
  @IsNotEmpty()
  @IsString()
  title: PostTitle;

  @ApiProperty({
    type: String,
    example: 'This is the content of my first blog post. It contains some interesting information.',
    description: 'The body content of the post',
  })
  @IsNotEmpty()
  @IsString()
  body: PostBody;
}
