import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';
import { Builder, StrictBuilder } from 'builder-pattern';
import type {
  IPost,
  PostBody,
  PostCreatedAt,
  PostId,
  PostTitle,
  PostUpdatedAt,
} from 'src/posts/applications/domains/post.domain';
import { CreatePostCommand, GetAllReturnType, PostRepository } from 'src/posts/applications/ports/post.repository';
import { GetAllMetaType, GetAllParamsType } from 'src/types/utility.type';
import { v4 as uuidv4 } from 'uuid';
import { PostEntity } from './post.entity';

@Injectable()
export class PostTypeOrmRepository implements PostRepository {
  constructor(private readonly postModel: TransactionHost<TransactionalAdapterTypeOrm>) {}

  async create(post: CreatePostCommand): Promise<IPost> {
    const uuid = uuidv4() as PostId;
    const resultCreated = await this.postModel.tx.getRepository(PostEntity).save({
      uuid: uuid,
      title: post.title,
      body: post.body,
    });
    return PostTypeOrmRepository.toDomain(resultCreated as PostEntity);
  }

  async deleteById(id: PostId): Promise<void> {
    await this.postModel.tx.getRepository(PostEntity).delete({ uuid: id });
  }

  async getAll(params: GetAllParamsType): Promise<GetAllReturnType> {
    const { search, sort, order, page, limit } = params;

    const currentPage = page ?? 1;
    const currentLimit = limit ?? 10;

    const queryBuilder = this.postModel.tx.getRepository(PostEntity).createQueryBuilder('post');

    if (search) {
      queryBuilder.where('post.title LIKE :search OR post.body LIKE :search', { search: `%${search}%` });
    }

    const sortableColumns = ['title', 'body', 'createdAt'];
    if (sort && sortableColumns.includes(sort)) {
      queryBuilder.orderBy(`post.${sort}`, order === 'ASC' ? 'ASC' : 'DESC');
    }

    if (currentLimit !== -1) {
      queryBuilder.skip((currentPage - 1) * currentLimit).take(currentLimit);
    }

    const [posts, count] = await queryBuilder.getManyAndCount();

    const result = posts.map((post) => PostTypeOrmRepository.toDomain(post));

    const meta = StrictBuilder<GetAllMetaType>().page(currentPage).limit(currentLimit).total(count).build();

    return StrictBuilder<GetAllReturnType>().result(result).meta(meta).build();
  }

  async getById(id: PostId): Promise<IPost | undefined> {
    const post = await this.postModel.tx.getRepository(PostEntity).findOne({
      where: {
        uuid: id,
      },
    });
    return post ? PostTypeOrmRepository.toDomain(post) : undefined;
  }

  async updateById(id: PostId, post: Partial<IPost>): Promise<IPost> {
    await this.postModel.tx.getRepository(PostEntity).update({ uuid: id }, post);
    const updatedPost = await this.postModel.tx.getRepository(PostEntity).findOne({
      where: {
        uuid: id,
      },
    });
    return PostTypeOrmRepository.toDomain(updatedPost as PostEntity);
  }

  public static toDomain(postEntity: PostEntity): IPost {
    return Builder<IPost>()
      .uuid(postEntity.uuid as PostId)
      .title(postEntity.title as PostTitle)
      .body(postEntity.body as PostBody)
      .createdAt(postEntity.createdAt as PostCreatedAt)
      .updatedAt(postEntity.updatedAt as PostUpdatedAt)
      .build();
  }
}
