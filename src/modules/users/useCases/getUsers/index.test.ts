import { Container } from 'typedi';
import UserFactory from '../../../../../test/factories/UserFactory';
import { FindOptions, GetUsersUseCase } from './index';
import { unsafeGetRightValue } from '../../../../common/logics';

describe('GetUsersUseCase', () => {
  it('should get users', async () => {
    const useCase = Container.get(GetUsersUseCase);

    await UserFactory.create();

    const result = await useCase.execute({ paginationArgs: { page: 1, size: 15 } } as FindOptions);

    expect(unsafeGetRightValue(result).total).toBe(1);
  });
});
