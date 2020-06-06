import { ValueObject } from 'common/domain';
import { Result } from 'common/functionalTypes/Result';
import * as bcrypt from 'bcrypt';
import BcryptSalt from 'bcrypt-salt';

interface UserPasswordProps {
  value: string;
  hashed?: boolean;
}

export default class UserPassword extends ValueObject<UserPasswordProps> {
  get value(): string {
    return this.props.value;
  }

  public static create(props: UserPasswordProps): Result<UserPassword> {
    return Result.ok(new UserPassword(props));
  }

  constructor(props: UserPasswordProps) {
    super(props);
  }

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    let hashed: string;
    if (this.isAlreadyHashed()) {
      hashed = this.props.value;
      return this.bcryptCompare(plainTextPassword, hashed);
    } else {
      return this.props.value === plainTextPassword;
    }
  }

  public isAlreadyHashed(): boolean {
    return this.props.hashed;
  }

  public getHashedValue(): Promise<string> {
    return new Promise(resolve => {
      if (this.isAlreadyHashed()) {
        return resolve(this.props.value);
      } else {
        return resolve(this.hashPassword(this.props.value));
      }
    });
  }

  private bcryptCompare(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }

  private hashPassword(password: string): Promise<string> {
    const bs = new BcryptSalt({ logs: false });

    return bcrypt.hash(password, bs.saltRounds);
  }
}
