import { Brand, CreatedAt, UpdatedAt } from 'src/types/utility.type';

// Use Branded type
export type PostId = Brand<string, 'PostId'>;
export type PostTitle = Brand<string, 'PostTitle'>;
export type PostBody = Brand<string, 'PostBody'>;
export type PostCreatedAt = Brand<CreatedAt, 'PostCreatedAt'>;
export type PostUpdatedAt = Brand<UpdatedAt, 'PostUpdatedAt'>;

export interface IPost {
  uuid: PostId;
  title: PostTitle;
  body: PostBody;
  createdAt?: PostCreatedAt;
  updatedAt?: PostUpdatedAt;
}

export class Post implements IPost {
  uuid: PostId;
  title: PostTitle;
  body: PostBody;
  createdAt?: PostCreatedAt;
  updatedAt?: PostUpdatedAt;

  // Business logic methods can be added here if needed
  // Example: validate(), canBeDeleted(), etc.
  // Only add methods if there is actual business logic.
}
