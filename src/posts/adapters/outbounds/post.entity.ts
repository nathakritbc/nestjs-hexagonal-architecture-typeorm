import type {
  PostBody,
  PostCreatedAt,
  PostId,
  PostTitle,
  PostUpdatedAt,
} from 'src/posts/applications/domains/post.domain';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export const postTableName = 'posts';

@Entity({
  name: postTableName,
})
export class PostEntity {
  @PrimaryColumn({
    type: 'uuid',
  })
  uuid: PostId;

  @Column({
    type: 'varchar',
  })
  title: PostTitle;

  @Column({
    type: 'varchar',
  })
  body: PostBody;

  @CreateDateColumn()
  declare createdAt: PostCreatedAt;

  @UpdateDateColumn()
  declare updatedAt: PostUpdatedAt;
}
