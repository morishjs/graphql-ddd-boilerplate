import { User } from './User';

const getUser = () => {
  const userDTO = {
    name: 'test',
    email: 'test@example.com',
    password: 'password',
    phone: '010-1234-5678',

    gender: 'female',
    birthdate: '2020/01/01',

    allowMarketing: true,
  };

  const userOrError = User.create(userDTO);
  return userOrError.getValue();
};

describe('User.test', () => {
  it('should create a User', () => {
    const user = getUser();

    expect(user.name).toBe('test');
    expect(user.email).toBe('test@example.com');
    expect(user.props.password.value).toBe('password');
    expect(!!user.props.password.isAlreadyHashed()).toBeFalsy();

    expect(user.profileDetail.birthdate).toBe('2020/01/01');
    expect(user.profileDetail.gender).toBe('female');
  });
});
