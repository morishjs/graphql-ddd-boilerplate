import { Result } from 'common/functionalTypes/Result';
import IError from './IError';

export namespace CommonDomainErrors {
  export class ValidationError extends Result<IError> {
    public static create(err?: any): ValidationError {
      return new ValidationError(err);
    }

    public constructor(err?: any) {
      super(false, err);
    }
  }

  export class DuplicationError extends Result<IError> {
    public static create(model: string): DuplicationError {
      return new DuplicationError(model);
    }

    public constructor(model: string) {
      super(false, {
        message: `${model} cannot be duplicate`,
      });
    }
  }
}
