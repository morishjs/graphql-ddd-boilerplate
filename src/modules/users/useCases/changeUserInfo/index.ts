import * as E from 'fp-ts/lib/Either';
import { OrmRepository } from 'typeorm-plus-typedi-extensions';
import { UserRepository } from 'modules/users/infra/UserRepository';
import { UseCase } from 'common/domain';
import { AppError } from 'common/errors/AppError';
import { CommonUseCaseErrors } from 'common/errors';
import { Changes } from 'common/WithChanges';
import { Logger, LoggerInterface } from '../../../../decorators/Logger';
import { isNone } from 'fp-ts/lib/Option';
import ModelNotExist = CommonUseCaseErrors.ModelNotExist;
import UnexpectedError = AppError.UnexpectedError;

type Response = E.Either<AppError.UnexpectedError | ModelNotExist, boolean>;

interface ChangeUserInfoDTO {
  userId: string;
  password?: string;
}

export class ChangeUserInfoUseCase implements UseCase<ChangeUserInfoDTO, Promise<Response>> {
  constructor(
    @OrmRepository() private userRepo: UserRepository,
    public changes: Changes,
    @Logger(__filename) private logger: LoggerInterface,
  ) {}

  public async execute(request: ChangeUserInfoDTO): Promise<Response> {
    try {
      const optionalUser = await this.userRepo.findOneById({ id: request.userId });
      if (isNone(optionalUser)) {
        return E.left(ModelNotExist.create('User'));
      }

      const user = optionalUser.value;

      if (request.password) {
        this.changes.addChange(user.updatePassword(request.password));
      }

      if (this.changes.getCombinedChangesResult().isSuccess) {
        await this.userRepo.saveOne(user);
        return E.right(true);
      } else {
        return E.left(UnexpectedError.create(this.changes.getCombinedChangesResult().errorMessage()));
      }
    } catch (err) {
      this.logger.error(err.message);
      return E.left(new AppError.UnexpectedError(err));
    }
  }
}
