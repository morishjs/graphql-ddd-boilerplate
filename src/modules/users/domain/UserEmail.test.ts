import UserEmail from './UserEmail';

describe('UserEmail.test', () => {
  it('should not create a UserEmail if provided address is invalid', () => {
    const userEmailOrError = UserEmail.create('@asdf.com');
    expect(userEmailOrError.errorValue()).not.toBeUndefined();
  });
});
