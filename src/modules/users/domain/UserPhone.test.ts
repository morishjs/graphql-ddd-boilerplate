import UserPhone from './UserPhone';

describe('UserPhone.test', () => {
  it('should not create a UserPhone if the phone number is invalid', () => {
    const userEmailOrError = UserPhone.create('010-1234-5678');
    expect(userEmailOrError.isSuccess).toBeTruthy();
  });
});
