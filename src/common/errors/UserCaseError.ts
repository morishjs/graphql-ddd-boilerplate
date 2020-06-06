import IError from './IError';

export default abstract class UseCaseError implements IError {
  public readonly message: string;
  public readonly error: Error;

  constructor(message: string, err?: Error) {
    this.message = message;
    this.error = err;
  }
}
