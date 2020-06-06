import IError from 'common/errors/IError';
import { Logger as WinstonLogger, LoggerInterface } from 'lib/logger';

type ErrorType = IError | string;

export class Result<T> {
  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error);
  }

  public static combine(results: Array<Result<any>>): Result<any> {
    for (const result of results) {
      if (result.isFailure) {
        return result;
      }
    }
    return Result.ok();
  }

  public static isResult<T>(value: Result<T> | any): value is Result<T> {
    return value?.constructor.name === 'Result';
  }
  public isSuccess: boolean;
  public isFailure: boolean;
  public error: ErrorType;
  private _value: T;
  private logger: LoggerInterface;

  public constructor(isSuccess: boolean, error?: ErrorType, value?: T) {
    if (isSuccess && error) {
      throw new Error('InvalidOperation: A result cannot be successful and contain an error');
    }
    if (!isSuccess && !error) {
      throw new Error('InvalidOperation: A failing result needs to contain an error message');
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;
    this.logger = new WinstonLogger();

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      console.log(this.error);
      throw new Error("Can't get the value of an error result. Use 'errorValue' instead.");
    }

    return this._value;
  }

  public errorValue(): ErrorType {
    return this.error;
  }

  public errorMessage(): string {
    if (typeof this.error === 'string') {
      return this.error;
    } else {
      this.logger.error(this.error.error.stack);

      return this.error.message;
    }
  }
}
