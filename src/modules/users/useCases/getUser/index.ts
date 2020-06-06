import * as E from 'fp-ts/lib/Either';
import UserDTO from 'modules/users/dtos/UserDTO';
import { OrmRepository } from 'typeorm-plus-typedi-extensions';
import { UserRepository } from 'modules/users/infra/UserRepository';
import UserMap from 'modules/users/mappers/UserMap';
import { UseCase } from 'common/domain';
import { AppError } from 'common/errors/AppError';
import { CommonUseCaseErrors } from 'common/errors';
import { isNone } from 'fp-ts/lib/Option';
import ModelNotExist = CommonUseCaseErrors.ModelNotExist;

type Response = E.Either<AppError.UnexpectedError | ModelNotExist, UserDTO>;

interface GetUserDTO {
  userId: string;
  withStylingOrders?: boolean;
}

export class GetUserUseCase implements UseCase<GetUserDTO, Promise<Response>> {
  constructor(@OrmRepository() private userRepo: UserRepository) {}

  public async execute(request: GetUserDTO): Promise<Response> {
    try {
      const optionalUser = await this.userRepo.findOneById({ id: request.userId });
      if (isNone(optionalUser)) {
        return E.left(ModelNotExist.create('User'));
      }

      return E.right(await UserMap.toDTO(optionalUser.value));
    } catch (err) {
      return E.left(new AppError.UnexpectedError(err));
    }
  }
}
