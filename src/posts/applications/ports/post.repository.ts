import { GetAllMetaType, GetAllParamsType } from 'src/types/utility.type';
import type { IPost, PostId } from '../domains/post.domain';

export type CreatePostCommand = Omit<IPost, 'uuid' | 'createdAt' | 'updatedAt'>;

export interface GetAllReturnType {
  result: IPost[];
  meta: GetAllMetaType;
}

const postRepositoryTokenSymbol: unique symbol = Symbol('PostRepository');
export const postRepositoryToken = postRepositoryTokenSymbol.toString();

export interface PostRepository {
  create(post: CreatePostCommand): Promise<IPost>;
  getById(id: PostId): Promise<IPost | undefined>;
  getAll(params: GetAllParamsType): Promise<GetAllReturnType>;
  updateById(id: PostId, post: Partial<IPost>): Promise<IPost>;
  deleteById(id: PostId): Promise<void>;

  // Add custom query methods as needed
  // getByTitle(title: PostTitle): Promise<IPost[]>;
}
