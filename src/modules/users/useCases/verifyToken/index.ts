import * as E from 'fp-ts/lib/Either';
import { OrmRepository } from 'typeorm-plus-typedi-extensions';
import { UserRepository } from 'modules/users/infra/UserRepository';
import { UseCase } from 'common/domain';
import { AppError } from 'common/errors/AppError';
import { CommonUseCaseErrors } from 'common/errors';
import { isNil } from 'common/logics';
import { RedisAuthService } from 'modules/users/services/redis/redisAuthService';
import ModelNotExist = CommonUseCaseErrors.ModelNotExist;
import UserNotExist = CommonUseCaseErrors.UserNotExist;

type Response = E.Either<AppError.UnexpectedError | ModelNotExist, boolean>;

interface VerifyTokenRequestDTO {
  userId: string;
  accessToken: string;
}

export class VerifyTokenUseCase implements UseCase<VerifyTokenRequestDTO, Promise<Response>> {
  constructor(@OrmRepository() private userRepo: UserRepository, private authService: RedisAuthService) {}

  public async execute(request: VerifyTokenRequestDTO): Promise<Response> {
    try {
      const user = await this.userRepo.findOneById({ id: request.userId });
      if (isNil(user)) {
        return E.left(UserNotExist.create());
      }

      return E.right(await this.authService.verifyJWT(request.accessToken));
    } catch (err) {
      return E.left(new AppError.UnexpectedError(err));
    }
  }
}
