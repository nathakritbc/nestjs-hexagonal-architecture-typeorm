import type { UserPassword, UserUsername } from '../../../../users/applications/domains/user.domain';

export interface LoginDto {
  username: UserUsername;
  password: UserPassword;
}
