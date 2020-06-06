import { Result } from 'common/functionalTypes/Result';
import UseCaseError from 'common/errors/UserCaseError';
import ExtendableError from 'extendable-error';

export namespace CommonUseCaseErrors {
  export class DomainCreationError extends Result<UseCaseError> {
    public static create(domainName: string, reason: string): DomainCreationError {
      return new DomainCreationError(domainName, reason);
    }

    public constructor(domainName: string, reason: string) {
      super(false, {
        message: `Failed to create the domain(${domainName}): ${reason}`,
        error: new Error(domainName),
      });
    }
  }

  export class DomainError extends Result<UseCaseError> {
    public static create(domainName: string, reason: string): DomainError {
      return new DomainError(domainName, reason);
    }

    public constructor(domainName: string, reason: string) {
      super(false, {
        message: `Error occurs during the domain(${domainName}) logic execution: ${reason}`,
        error: new Error(domainName),
      });
    }
  }

  export class AlreadyModelExist extends Result<UseCaseError> {
    public static create(modelName: string): AlreadyModelExist {
      return new AlreadyModelExist(modelName);
    }

    public constructor(modelName: string) {
      super(false, {
        message: `the model(${modelName}) already exists`,
        error: new Error(modelName),
      });
    }
  }

  export class ModelNotExist extends Result<UseCaseError> {
    public static create(modelName: string): ModelNotExist {
      return new ModelNotExist(modelName);
    }

    public constructor(modelName: string) {
      super(false, {
        message: `the model(${modelName}) doesn't exist`,
        error: new Error(modelName),
      });
    }
  }

  export class UserNotExist extends Result<UseCaseError> {
    public static create(): UserNotExist {
      return new UserNotExist();
    }

    public constructor() {
      super(false, {
        message: `the user doesn't exist`,
        error: new Error(),
      });
    }
  }

  export class ProductNotExist extends Result<UseCaseError> {
    public static create(): ProductNotExist {
      return new ProductNotExist();
    }

    public constructor() {
      super(false, {
        message: `the product doesn't exist`,
        error: new Error(),
      });
    }
  }

  export class ParamsValidationError extends Result<UseCaseError> {
    public static create(message?: string): ProductNotExist {
      return new ParamsValidationError(message);
    }

    public constructor(message?: string) {
      super(false, {
        message: `Given params is invalid ${message}`,
        error: new Error(),
      });
    }
  }

  export class AuthenticationError extends ExtendableError {
    constructor(message: string) {
      super(message);
    }
    public errorMessage(): string {
      return this.message;
    }
  }
}
