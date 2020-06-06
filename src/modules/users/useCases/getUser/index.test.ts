import { Container } from 'typedi';
import { unsafeGetRightValue } from 'common/logics';
import { GetUserUseCase } from './index';
import UserFactory from '../../../../../test/factories/UserFactory';

describe('GetUserUseCase', () => {
  it('should get a user', async () => {
    const useCase = Container.get(GetUserUseCase);

    const user = await UserFactory.create();

    const result = await useCase.execute({ userId: user.id });
    const userDTO = unsafeGetRightValue(result);

    expect(userDTO).not.toBeUndefined();
  });
});
