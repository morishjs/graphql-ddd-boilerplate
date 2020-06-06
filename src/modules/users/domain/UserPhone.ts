import { ValueObject } from 'common/domain';
import { Result } from 'common/functionalTypes/Result';

interface UserPhoneProps {
  value: string;
}

export default class UserPhone extends ValueObject<UserPhoneProps> {
  get value(): string {
    return this.props.value;
  }

  public static create(phone: string): Result<UserPhone> {
    if (!!phone === false || phone.match(/^\d{3}-\d{3,4}-\d{4}$/).length !== 1) {
      return Result.fail<UserPhone>('Must provide a valid phone number');
    } else {
      return Result.ok<UserPhone>(new UserPhone({ value: phone }));
    }
  }

  constructor(props: UserPhoneProps) {
    super(props);
  }
}
