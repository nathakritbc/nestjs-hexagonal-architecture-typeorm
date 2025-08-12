import { faker } from '@faker-js/faker';
import { StrictBuilder } from 'builder-pattern';
import { mock } from 'vitest-mock-extended';
import { IUser, UserUsername } from '../domains/user.domain';
import { UserRepository } from '../ports/user.repository';
import { GetUserByUsernameQuery, GetUserByUsernameUseCase } from './getUserByUsername.usecase';

describe('Get User By Username Use Case', () => {
  let useCase: GetUserByUsernameUseCase;
  const userRepository = mock<UserRepository>();

  beforeEach(() => {
    useCase = new GetUserByUsernameUseCase(userRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should be return undefined when user is not exist.', async () => {
    // Arrange
    const username = faker.internet.username() as UserUsername;
    userRepository.getByUsername.mockResolvedValue(undefined);

    const query = StrictBuilder<GetUserByUsernameQuery>().username(username).build();

    // Act
    const actual = await useCase.execute(query);

    // Assert
    expect(actual).toBeUndefined();
    expect(userRepository.getByUsername).toHaveBeenCalledWith(username);
  });

  it('should be get user by username when user is exist.', async () => {
    // Arrange
    const username = faker.internet.username() as UserUsername;
    const user = mock<IUser>({
      username,
    });

    userRepository.getByUsername.mockResolvedValue(user);

    const query = StrictBuilder<GetUserByUsernameQuery>().username(username).build();

    const expected = user;

    // Act
    const actual = await useCase.execute(query);

    // Assert
    expect(actual).toEqual(expected);
    expect(userRepository.getByUsername).toHaveBeenCalledWith(username);
  });
});
