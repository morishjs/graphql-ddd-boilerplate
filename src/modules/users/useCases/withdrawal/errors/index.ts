import ExtendableError from 'extendable-error';

export namespace UserWithdrawalUseCaseErrors {
  export class ActiveStylingOrderExist extends ExtendableError {
    constructor() {
      super('active styling order exists, hence user cannot withdrawal');
    }
    public errorMessage(): string {
      return this.message;
    }
  }
}
