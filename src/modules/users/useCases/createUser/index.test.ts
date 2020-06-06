import { Container } from 'typedi';
import { unsafeGetRightValue } from 'common/logics';
import { CreateUserUseCase } from './index';
import * as faker from 'faker';

describe('CreateUserUseCase', () => {
  it('should create a user', async () => {
    const useCase = Container.get(CreateUserUseCase);
    const requestDTO = {
      name: 'test',
      email: faker.internet.email(),
      phone: faker.phone.phoneNumberFormat(0),
      password: 'password',
      gender: 'female',
      birthdate: '2020/01/01',
    };

    const result = await useCase.execute(requestDTO);
    expect(unsafeGetRightValue(result)).toMatchObject({
      name: requestDTO.name,
      email: requestDTO.email,
      phone: requestDTO.phone,
      gender: requestDTO.gender,
      birthdate: requestDTO.birthdate,
    });
  });

  test('User has profile detail', async () => {
    const useCase = Container.get(CreateUserUseCase);
    const requestDTO = {
      name: 'test',
      email: faker.internet.email(),
      phone: faker.phone.phoneNumberFormat(0),
      password: 'password',
      gender: 'female',
      birthdate: '2020/01/01',
    };

    const result = await useCase.execute(requestDTO);
    expect(unsafeGetRightValue(result)).toMatchObject({
      birthdate: requestDTO.birthdate,
      email: requestDTO.email,
      gender: requestDTO.gender,
      name: requestDTO.name,
      phone: requestDTO.phone,
    });
  });

  it('should not create a user if the email is already taken', async () => {
    const useCase = Container.get(CreateUserUseCase);
    const requestDTO = {
      name: 'test',
      email: 'test@admin.com',
      phone: faker.phone.phoneNumberFormat(0),
      password: 'password',
      gender: 'female',
      birthdate: '2020/01/01',
      selectboxReasons: ['test'],
    };
    const requestDTO2 = {
      name: 'test',
      email: 'test@admin.com',
      phone: faker.phone.phoneNumberFormat(0),
      password: 'password',
      gender: 'female',
      birthdate: '2020/01/01',
    };

    await useCase.execute(requestDTO);
    const result = await useCase.execute(requestDTO2);
    expect(unsafeGetRightValue(result)).toBeUndefined();
  });

  it('should not create a user who already signed up before', async () => {
    const useCase = Container.get(CreateUserUseCase);
    const phone = faker.phone.phoneNumberFormat(0);
    const requestDTO = {
      name: 'test',
      email: 'test@admin.com',
      phone,
      password: 'password',
      gender: 'female',
      birthdate: '2020/01/01',
      selectboxReasons: ['test'],
    };
    const requestDTO2 = {
      name: 'test',
      email: 'test1@admin.com',
      phone,
      password: 'password',
      gender: 'female',
      birthdate: '2020/01/01',
    };

    await useCase.execute(requestDTO);
    const result = await useCase.execute(requestDTO2);
    expect(unsafeGetRightValue(result)).toBeUndefined();
  });
});
