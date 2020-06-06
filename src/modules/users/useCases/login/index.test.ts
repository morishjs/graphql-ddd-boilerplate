import { Container } from 'typedi';
import { unsafeGetRightValue } from 'common/logics';
import { LoginUseCase } from 'modules/users/useCases/login/index';
import UserFactory from '../../../../../test/factories/UserFactory';
import { RedisAuthService } from '../../services/redis/redisAuthService';
import { RepositoryMock } from '../../../../../test/unit/lib/RepositoryMock';
import UserMap from 'modules/users/mappers/UserMap';
import { User } from 'modules/users/domain/User';
import * as faker from 'faker';

describe('LoginUseCase', () => {
  it('should get a token', async () => {
    const userRepo = new RepositoryMock<User>();
    const user = await UserFactory.create({
      name: 'test',
      email: faker.internet.email(),
      password: 'test_password',
    });
    const userDomain = UserMap.persistenceToDomain(user);
    userDomain.props.password.props.hashed = false;
    userRepo.one = userDomain;

    const authService = Container.get<RedisAuthService>(RedisAuthService);

    const useCase = new LoginUseCase(userRepo as any, authService);
    const requestDTO = {
      email: user.email,
      password: user.password,
    };

    const result = await useCase.execute(requestDTO);
    const { accessToken, refreshToken, userId } = unsafeGetRightValue(result);
    expect(accessToken).not.toBeNull();
    expect(userId).not.toBeNull();
    expect(refreshToken).not.toBeNull();
  });
});
