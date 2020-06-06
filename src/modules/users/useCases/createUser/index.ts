import * as E from 'fp-ts/lib/Either';
import { User } from 'modules/users/domain/User';
import UserDTO from 'modules/users/dtos/UserDTO';
import { OrmRepository } from 'typeorm-plus-typedi-extensions';
import { UserRepository } from 'modules/users/infra/UserRepository';
import UserMap from 'modules/users/mappers/UserMap';
import { UseCase } from 'common/domain';
import { AppError } from 'common/errors/AppError';
import { CommonUseCaseErrors } from 'common/errors';
import { RefreshToken } from '../../domain/Jwt';
import { RedisAuthService } from '../../services/redis/redisAuthService';
import { UserInput } from 'modules/users/dtos/inputs/UserInput';
import { CreateUserErrors } from './errors';
import AlreadyModelExist = CommonUseCaseErrors.AlreadyModelExist;
import DomainCreationError = CommonUseCaseErrors.DomainCreationError;
import EmailDuplication = CreateUserErrors.EmailDuplication;
import PhoneDuplication = CreateUserErrors.PhoneDuplication;

type Response = E.Either<
  AppError.UnexpectedError | DomainCreationError | EmailDuplication | PhoneDuplication | AlreadyModelExist,
  UserDTO
>;

type CreateUserDTO = UserInput;

export class CreateUserUseCase implements UseCase<CreateUserDTO, Promise<Response>> {
  constructor(@OrmRepository() private userRepo: UserRepository, private authService: RedisAuthService) {}

  public async execute(request: CreateUserDTO): Promise<Response> {
    try {
      const emailDuplication = await this.userRepo.checkEmailDuplication(request.email);
      if (emailDuplication) {
        return E.left(new EmailDuplication('Email was already taken'));
      }

      const phoneDuplication = await this.userRepo.checkPhoneDuplication(request.phone);
      if (phoneDuplication) {
        return E.left(new PhoneDuplication('user already signed up'));
      }

      const userOrError = User.create(request);

      if (userOrError.isFailure) {
        return E.left(DomainCreationError.create('User', userOrError.error.toString()));
      }

      const user = userOrError.getValue();
      const accessToken = this.authService.signJWT({
        email: user.props.email.value,
        userId: user.id.toString(),
      });
      const refreshToken: RefreshToken = this.authService.createRefreshToken();
      user.setAccessToken(accessToken, refreshToken);
      await this.authService.saveAuthenticatedUser(user);

      await this.userRepo.saveOne(user);

      return E.right(await UserMap.toDTO(user));
    } catch (err) {
      return E.left(new AppError.UnexpectedError(err));
    }
  }
}
