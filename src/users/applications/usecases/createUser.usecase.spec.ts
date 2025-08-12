import { faker } from '@faker-js/faker';
import { Builder, StrictBuilder } from 'builder-pattern';
import { mock } from 'vitest-mock-extended';
import { User, UserEmail, UserPassword, UserUsername } from '../domains/user.domain';
import { UserRepository } from '../ports/user.repository';
import { CreateUserCommand, CreateUserUseCase } from './createUser.usecase';

describe('Create User Use case', () => {
  let useCase: CreateUserUseCase;
  const userRepository = mock<UserRepository>();

  beforeEach(() => {
    useCase = new CreateUserUseCase(userRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should be create user.', async () => {
    // Arrange
    const username = faker.internet.username() as UserUsername;
    const password = faker.internet.password() as UserPassword;
    const email = faker.internet.email() as UserEmail;
    const expectedForRepository = Builder(User).username(username).email(email).build(); // password will be undefined
    const expected = Builder(User)
      .username(username)
      .email(email)
      .password('' as UserPassword)
      .build();

    userRepository.create.mockResolvedValue(expected);
    const setHashPasswordSpy = vi.spyOn(User.prototype, 'setHashPassword').mockImplementation(async () => {});
    const hiddenPasswordSpy = vi.spyOn(User.prototype, 'hiddenPassword');

    const command = StrictBuilder<CreateUserCommand>().username(username).email(email).password(password).build();

    // Act
    const actual = await useCase.execute(command);

    // Assert
    expect(actual).toEqual(expected);
    expect(setHashPasswordSpy).toHaveBeenCalledWith(password);
    expect(hiddenPasswordSpy).toHaveBeenCalled();
    expect(userRepository.create).toHaveBeenCalledWith(expectedForRepository);
  });
});
