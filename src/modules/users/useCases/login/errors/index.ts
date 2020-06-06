import { Result } from 'common/functionalTypes/Result';
import UseCaseError from 'common/errors/UserCaseError';

export namespace LoginUseCaseErrors {
  export class PasswordNotMatch extends Result<UseCaseError> {
    public static create(): PasswordNotMatch {
      return new PasswordNotMatch();
    }

    public constructor() {
      super(false, {
        message: `password doesn't match!`,
        error: new Error(),
      });
    }
  }
}
