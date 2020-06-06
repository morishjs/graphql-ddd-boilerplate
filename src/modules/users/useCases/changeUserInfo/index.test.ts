import { Container } from 'typedi';
import { unsafeGetRightValue } from 'common/logics';
import UserFactory from '../../../../../test/factories/UserFactory';
import { ChangeUserInfoUseCase } from './index';

describe('ChangeUserInfoUseCase', () => {
  it('should update user password', async () => {
    const useCase = Container.get(ChangeUserInfoUseCase);
    const user = await UserFactory.create();
    const requestDTO = {
      userId: user.id,
      password: 'test',
    };

    const result = await useCase.execute(requestDTO);
    expect(unsafeGetRightValue(result)).toBe(true);
  });
});
