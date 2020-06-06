import * as t from 'io-ts';
import { AggregateRoot } from 'common/domain/AggregateRoot';
import { UniqueEntityID } from 'common/domain';
import { unsafeGetRightValue } from 'common/logics';
import UserPassword from 'modules/users/domain/UserPassword';
import UserName from 'modules/users/domain/UserName';
import { Result } from 'common/functionalTypes/Result';
import { Nullable } from 'common/types';
import { JWTToken, RefreshToken } from './Jwt';
import { isLeft } from 'fp-ts/lib/Either';
import UserEmail from 'modules/users/domain/UserEmail';
import UserPhone from './UserPhone';
import { PathReporter } from 'io-ts/lib/PathReporter';

export const StyleProfile = t.type({
  complete: t.boolean,
  completedStep: t.number,
  data: t.record(t.string, t.record(t.string, t.record(t.string, t.union([t.string, t.array(t.string)])))),
});

export interface UserProfileDetail {
  birthdate: string;
  gender: string;
}

interface UserProps {
  name: UserName;
  email: UserEmail;
  password: UserPassword;
  phone: UserPhone;
  profileDetail: UserProfileDetail;

  accessToken?: JWTToken;
  refreshToken?: RefreshToken;
}

const RequiredArgs = t.type({
  name: t.string,
  email: t.string,
  phone: t.string,
  password: t.string,
  gender: t.string,
  birthdate: t.string,
});

const OptionalArgs = t.partial({
  id: t.union([Nullable, t.string]),
  passwordHashed: t.union([Nullable, t.boolean]),
});

export const UserArgs = t.intersection([RequiredArgs, OptionalArgs]);

export class User extends AggregateRoot<UserProps> {
  get email(): string {
    return this.props.email.value;
  }

  get name(): string {
    return this.props.name.value;
  }

  get phone(): string {
    return this.props.phone.value;
  }

  get profileDetail(): UserProfileDetail {
    return this.props.profileDetail;
  }

  public static create(args: t.TypeOf<typeof UserArgs>): Result<User> {
    const userInput = UserArgs.decode(args);
    if (isLeft(userInput)) {
      return Result.fail(PathReporter.report(userInput).toString());
    }

    const unsafeInput = unsafeGetRightValue(userInput);
    const nameOrError = UserName.create(unsafeInput.name);
    const emailOrError = UserEmail.create(unsafeInput.email);
    const phoneOrError = UserPhone.create(unsafeInput.phone);
    const passwordOrError = UserPassword.create({ value: unsafeInput.password, hashed: unsafeInput.passwordHashed });
    const profileDetail = {} as UserProfileDetail;

    const results = [phoneOrError, nameOrError, emailOrError, passwordOrError];

    const guard = Result.combine(results);
    if (guard.isFailure) {
      return Result.fail(guard.errorMessage());
    }

    profileDetail.birthdate = unsafeInput.birthdate;
    profileDetail.gender = unsafeInput.gender;

    return Result.ok(
      new User(
        {
          name: nameOrError.getValue(),
          email: emailOrError.getValue(),
          phone: phoneOrError.getValue(),
          password: passwordOrError.getValue(),
          profileDetail,
        },
        new UniqueEntityID(args.id),
      ),
    );
  }

  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public isLoggedIn(): boolean {
    return !!this.props.accessToken && !!this.props.refreshToken;
  }

  public setAccessToken(token: JWTToken, refreshToken: RefreshToken): void {
    this.props.accessToken = token;
    this.props.refreshToken = refreshToken;
  }

  public updatePassword(password: string): Result<any> {
    const passwordOrError = UserPassword.create({ value: password, hashed: false });
    if (passwordOrError.isFailure) {
      return passwordOrError;
    }

    this.props.password = passwordOrError.getValue();
    return Result.ok();
  }
}
