import { ValueObject } from 'common/domain';
import { Result } from 'common/functionalTypes/Result';

interface UserNameProps {
  value: string;
}

export default class UserName extends ValueObject<UserNameProps> {
  get value(): string {
    return this.props.value;
  }

  public static create(name: string): Result<UserName> {
    return Result.ok(new UserName({ value: name }));
  }

  constructor(props: UserNameProps) {
    super(props);
  }
}
