import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { v4 as uuidv4 } from 'uuid';
import { IUser, User, UserId, UserUpdatedAt, UserUsername } from '../../applications/domains/user.domain';
import { UserRepository } from '../../applications/ports/user.repository';
import { UserEntity } from './user.entity';

@Injectable()
export class UserMongoRepository implements UserRepository {
  constructor(private readonly userModel: TransactionHost<TransactionalAdapterTypeOrm>) {}

  async create(user: IUser): Promise<IUser> {
    const uuid = uuidv4() as UserId;
    const resultCreated = await this.userModel.tx.getRepository(UserEntity).save({
      uuid: uuid,
      username: user.username,
      email: user.email,
      password: user.password,
    });
    return UserMongoRepository.toDomain(resultCreated);
  }

  async getByUsername(username: string): Promise<IUser | undefined> {
    const user = await this.userModel.tx.getRepository(UserEntity).findOne({
      where: { username: username as UserUsername },
    });
    return user ? UserMongoRepository.toDomain(user) : undefined;
  }

  static toDomain(user: UserEntity): IUser {
    return Builder(User)
      .id(user.uuid as UserId)
      .username(user.username)
      .email(user.email)
      .password(user.password)
      .createdAt(user.createdAt)
      .updateAt(user.updatedAt as UserUpdatedAt)
      .build();
  }
}
