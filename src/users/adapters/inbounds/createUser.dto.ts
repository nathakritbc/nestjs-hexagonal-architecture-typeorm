import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import type { UserEmail, UserPassword, UserUsername } from '../../applications/domains/user.domain';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: UserUsername;

  @IsEmail()
  @IsNotEmpty()
  email: UserEmail;

  @IsString()
  @IsNotEmpty()
  password: UserPassword;
}
