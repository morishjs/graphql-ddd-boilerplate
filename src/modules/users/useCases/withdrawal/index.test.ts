import { Container } from 'typedi';
import { unsafeGetRightValue } from 'common/logics';
import { UserWithdrawalUseCase } from './index';
import UserFactory from '../../../../../test/factories/UserFactory';

describe('UserWithdrawalUseCase', () => {
  it('should delete a user', async () => {
    const useCase = Container.get(UserWithdrawalUseCase);
    const user = await UserFactory.create();
    const requestDTO = {
      userId: user.id,
      accessToken: 'test',
      refreshToken: 'test',
    };

    const result = await useCase.execute(requestDTO);
    expect(unsafeGetRightValue(result)).toBe(user.id);
  });
});
