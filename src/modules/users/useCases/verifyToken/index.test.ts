import { Container } from 'typedi';
import { unsafeGetRightValue } from 'common/logics';
import UserFactory from '../../../../../test/factories/UserFactory';
import { RedisAuthService } from 'modules/users/services/redis/redisAuthService';
import { VerifyTokenUseCase } from './index';

describe('VerifyTokenUseCase', () => {
  it('should return true if given token is valid', async () => {
    const user = await UserFactory.create();
    const authService = Container.get<RedisAuthService>(RedisAuthService);
    const token = await authService.signJWT({ userId: user.id, email: user.email });

    const useCase = Container.get<VerifyTokenUseCase>(VerifyTokenUseCase);
    const requestDTO = {
      userId: user.id,
      accessToken: token,
    };

    const result = await useCase.execute(requestDTO);
    expect(unsafeGetRightValue(result)).toBeTruthy();
  });
});
