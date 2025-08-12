import { faker } from '@faker-js/faker';
import { UnauthorizedException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import { mock } from 'vitest-mock-extended';

import { StrictBuilder } from 'builder-pattern';
import type { IUser, UserId, UserPassword, UserUsername } from '../../users/applications/domains/user.domain';
import { UserRepository } from '../../users/applications/ports/user.repository';
import { LoginCommand, LoginUseCase } from './login.usecase';

describe('Login Use Case', () => {
  it('should be return jwt sign when user is exist and password correct.', async () => {
    // Arrange
    const userId = faker.database.mongodbObjectId() as UserId;
    const username = faker.internet.username() as UserUsername;
    const password = faker.internet.password() as UserPassword;

    const user = mock<IUser>({
      id: userId,
      username,
    });
    user.comparePassword.mockResolvedValue(true);
    const userRepository = mock<UserRepository>();
    userRepository.getByUsername.mockResolvedValue(user);

    const jwtService = mock<JwtService>();
    jwtService.sign.mockResolvedValue(faker.string.alphanumeric());

    const loginUseCase = new LoginUseCase(userRepository, jwtService);

    const command = StrictBuilder<LoginCommand>().username(username).password(password).build();

    const jwtSignCallExpected = {
      sub: userId,
      username,
    };

    // Act
    const actual = await loginUseCase.execute(command);

    // Assert
    expect(actual).not.toBeNull();
    expect(user.comparePassword).toHaveBeenCalledWith(password);
    expect(jwtService.sign).toHaveBeenCalledWith(jwtSignCallExpected);
  });

  it('should be throw error when user not found.', async () => {
    // Arrange
    const username = faker.internet.username() as UserUsername;
    const password = faker.internet.password() as UserPassword;

    const userRepository = mock<UserRepository>();
    userRepository.getByUsername.mockResolvedValue(undefined);

    const jwtService = mock<JwtService>();
    const loginUseCase = new LoginUseCase(userRepository, jwtService);

    const command = StrictBuilder<LoginCommand>().username(username).password(password).build();

    const errorExpected = new UnauthorizedException('Invalid username or password.');

    // Act
    const actPromise = loginUseCase.execute(command);

    // Assert
    await expect(actPromise).rejects.toThrow(errorExpected);
  });

  it('should be return jwt sign when user is exist and password incorrect.', async () => {
    // Arrange
    const userId = faker.database.mongodbObjectId() as UserId;
    const username = faker.internet.username() as UserUsername;
    const password = faker.internet.password() as UserPassword;

    const user = mock<IUser>({
      id: userId,
      username,
    });
    user.comparePassword.mockResolvedValue(false);
    const userRepository = mock<UserRepository>();
    userRepository.getByUsername.mockResolvedValue(user);

    const jwtService = mock<JwtService>();

    const loginUseCase = new LoginUseCase(userRepository, jwtService);

    const command = StrictBuilder<LoginCommand>().username(username).password(password).build();

    const jwtSignCallExpected = {
      sub: userId,
      username,
    };

    const errorExpected = new UnauthorizedException('Invalid username or password.');

    // Act
    const actPromise = loginUseCase.execute(command);

    // Assert
    await expect(actPromise).rejects.toThrow(errorExpected);
    expect(user.comparePassword).toHaveBeenCalledWith(password);
    expect(jwtService.sign).not.toHaveBeenCalledWith(jwtSignCallExpected);
  });
});
