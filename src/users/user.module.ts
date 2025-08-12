import { Module } from '@nestjs/common';
import { UserController } from './adapters/inbounds/user.controller';
import { UserTypeOrmRepository } from './adapters/outbounds/user.typeorm.repository';
import { userRepositoryToken } from './applications/ports/user.repository';
import { CreateUserUseCase } from './applications/usecases/createUser.usecase';
import { GetUserByUsernameUseCase } from './applications/usecases/getUserByUsername.usecase';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    {
      provide: userRepositoryToken,
      useClass: UserTypeOrmRepository,
    },
    CreateUserUseCase,
    GetUserByUsernameUseCase,
  ],
})
export class UserModule {}
