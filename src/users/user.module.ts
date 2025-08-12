import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/databases/database.module';
import { UserController } from './adapters/inbounds/user.controller';
import { UserMongoRepository } from './adapters/outbounds/user.mongo.repository';
import { userRepositoryToken } from './applications/ports/user.repository';
import { CreateUserUseCase } from './applications/usecases/createUser.usecase';
import { GetUserByUsernameUseCase } from './applications/usecases/getUserByUsername.usecase';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    {
      provide: userRepositoryToken,
      useClass: UserMongoRepository,
    },
    CreateUserUseCase,
    GetUserByUsernameUseCase,
  ],
})
export class UserModule {}
