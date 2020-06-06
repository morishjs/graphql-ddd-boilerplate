import ExtendableError from 'extendable-error';

export namespace UserErrors {
  export class CardInfoChangeOnDelivery extends ExtendableError {
    constructor() {
      super('Cannot change card information if there is selectbox on delivery');
    }
    public errorMessage(): string {
      return this.message;
    }
  }

  export class CardInfoNotExist extends ExtendableError {
    constructor() {
      super('User does not register a card');
    }
    public errorMessage(): string {
      return this.message;
    }
  }
}
