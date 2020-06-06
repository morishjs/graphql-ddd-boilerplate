import { ValueObject } from 'common/domain';
import { Result } from 'common/functionalTypes/Result';
import * as Joi from 'types-joi';
import { exists } from 'common/logics';

interface UserEmailProps {
  value: string;
}

export default class UserEmail extends ValueObject<UserEmailProps> {
  get value(): string {
    return this.props.value;
  }

  public static create(name: string): Result<UserEmail> {
    const schema = Joi.string().email();
    const { error } = schema.validate(name);
    if (exists(error)) {
      return Result.fail('Invalid email address');
    }

    return Result.ok(new UserEmail({ value: name }));
  }

  constructor(props: UserEmailProps) {
    super(props);
  }
}
