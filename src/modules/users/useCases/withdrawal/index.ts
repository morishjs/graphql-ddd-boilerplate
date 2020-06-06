import * as E from 'fp-ts/lib/Either';
import { OrmRepository } from 'typeorm-plus-typedi-extensions';
import { UserRepository } from 'modules/users/infra/UserRepository';
import { UseCase } from 'common/domain';
import { AppError } from 'common/errors/AppError';
import { CommonUseCaseErrors } from 'common/errors';
import { IdToken } from '../../domain/Jwt';
import { RedisAuthService } from '../../services/redis/redisAuthService';
import { UserWithdrawalUseCaseErrors } from './errors';
import { isNone } from 'fp-ts/lib/Option';
import ModelNotExist = CommonUseCaseErrors.ModelNotExist;
import ActiveStylingOrderExist = UserWithdrawalUseCaseErrors.ActiveStylingOrderExist;

type Response = E.Either<AppError.UnexpectedError | ModelNotExist | ActiveStylingOrderExist, string>;

type UserWithdrawalDTO = IdToken;

export class UserWithdrawalUseCase implements UseCase<UserWithdrawalDTO, Promise<Response>> {
  constructor(@OrmRepository() private userRepo: UserRepository, private authService: RedisAuthService) {}

  public async execute(request: UserWithdrawalDTO): Promise<Response> {
    try {
      const optionalUser = await this.userRepo.findOneById({ id: request.userId });
      if (isNone(optionalUser)) {
        return E.left(ModelNotExist.create('User'));
      }

      const user = optionalUser.value;

      await this.userRepo.removeOne(user);
      await this.authService.deAuthenticateUser(user.email);

      return E.right(user.id.toString());
    } catch (err) {
      return E.left(new AppError.UnexpectedError(err));
    }
  }
}
