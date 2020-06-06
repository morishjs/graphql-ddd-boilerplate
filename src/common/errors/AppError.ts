import UseCaseError from './UserCaseError';
import { Result } from 'common/functionalTypes/Result';

export namespace AppError {
  export class UnexpectedError extends Result<UseCaseError> {
    public static create(err?: any): UnexpectedError {
      return new UnexpectedError(err);
    }
    public constructor(err?: any) {
      super(false, {
        message: `An unexpected error occurred`,
        error: err,
      } as UseCaseError);
    }
  }
}
