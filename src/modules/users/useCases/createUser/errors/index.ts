import ExtendableError from 'extendable-error';

export namespace CreateUserErrors {
  export class EmailDuplication extends ExtendableError {
    constructor(message: string) {
      super(message);
    }
    public errorMessage(): string {
      return this.message;
    }
  }

  export class PhoneDuplication extends ExtendableError {
    constructor(message: string) {
      super(message);
    }
    public errorMessage(): string {
      return this.message;
    }
  }
}
