import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { DatabaseModule } from 'src/databases/database.module';
import { jwtExpiresIn, jwtSecret } from '../configs/jwt.config';
import { UserMongoRepository } from '../users/adapters/outbounds/user.mongo.repository';
import { userRepositoryToken } from '../users/applications/ports/user.repository';
import { AuthController } from './adapters/inbounds/auth.controller';
import { JwtStrategy } from './jwtStrategy';
import { LoginUseCase } from './usecases/login.usecase';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({ secret: jwtSecret, signOptions: { expiresIn: jwtExpiresIn } }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    LoginUseCase,
    {
      provide: userRepositoryToken,
      useClass: UserMongoRepository,
    },
  ],
})
export class AuthModule {}
