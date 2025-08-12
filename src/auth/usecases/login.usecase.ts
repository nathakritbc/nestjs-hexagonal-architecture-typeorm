import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { UserPassword, UserUsername } from '../../users/applications/domains/user.domain';
import type { UserRepository } from '../../users/applications/ports/user.repository';
import { userRepositoryToken } from '../../users/applications/ports/user.repository';

export interface LoginCommand {
  username: UserUsername;
  password: UserPassword;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(userRepositoryToken)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}
  async execute({ username, password }: LoginCommand): Promise<string> {
    const user = await this.userRepository.getByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password.');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid username or password.');
    }

    return this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });
  }
}
