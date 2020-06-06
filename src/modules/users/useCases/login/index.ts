import * as E from 'fp-ts/lib/Either';
import { OrmRepository } from 'typeorm-plus-typedi-extensions';
import { UserRepository } from 'modules/users/infra/UserRepository';
import { UseCase } from 'common/domain';
import { AppError } from 'common/errors/AppError';
import { CommonUseCaseErrors } from 'common/errors';
import { LoginUseCaseErrors } from 'modules/users/useCases/login/errors';
import { RefreshToken } from 'modules/users/domain/Jwt';
import LoginDTO from 'modules/users/dtos/LoginDTO';
import { Service } from 'typedi';
import { RedisAuthService } from 'modules/users/services/redis/redisAuthService';
import { isNone } from 'fp-ts/lib/Option';
import DomainCreationError = CommonUseCaseErrors.DomainCreationError;
import ModelNotExist = CommonUseCaseErrors.ModelNotExist;
import PasswordNotMatch = LoginUseCaseErrors.PasswordNotMatch;

type Response = E.Either<AppError.UnexpectedError | DomainCreationError | PasswordNotMatch | ModelNotExist, LoginDTO>;

interface LoginRequestDTO {
  email: string;
  password: string;
}

@Service()
export class LoginUseCase implements UseCase<LoginRequestDTO, Promise<Response>> {
  constructor(@OrmRepository() private userRepo: UserRepository, private authService: RedisAuthService) {}

  public async execute(request: LoginRequestDTO): Promise<Response> {
    try {
      const optionalUser = await this.userRepo.findOneBy({ email: request.email });
      if (isNone(optionalUser)) {
        return E.left(ModelNotExist.create('User'));
      }

      const user = optionalUser.value;
      const passwordValid = await user.props.password.comparePassword(request.password);
      if (!passwordValid) {
        return E.left(PasswordNotMatch.create());
      }

      const accessToken = this.authService.signJWT({
        email: user.props.email.value,
        userId: user.id.toString(),
      });
      const refreshToken: RefreshToken = this.authService.createRefreshToken();
      user.setAccessToken(accessToken, refreshToken);
      await this.authService.saveAuthenticatedUser(user);

      return E.right({
        accessToken,
        refreshToken,
        userId: user.id.toString(),
      });
    } catch (err) {
      return E.left(new AppError.UnexpectedError(err));
    }
  }
}
