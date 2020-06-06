import * as E from 'fp-ts/lib/Either';
import { OrmRepository } from 'typeorm-plus-typedi-extensions';
import { UserRepository } from 'modules/users/infra/UserRepository';
import UserMap from 'modules/users/mappers/UserMap';
import { UseCase } from 'common/domain';
import { AppError } from 'common/errors/AppError';
import { PaginationArgs } from '../../../../api/args/PaginationArgs';
import Users from 'modules/users/dtos/Users';
import { Brand } from 'utility-types';
import { User } from '../../domain/User';

export type FindOptions = Brand<
  {
    paginationArgs?: PaginationArgs;
  },
  'FindOptions'
>;
export type FindByUserOptions = Brand<{ userName?: string }, 'FindByUserOptions'>;
type GetUsersDTO = FindOptions | FindByUserOptions;

type Response = E.Either<AppError.UnexpectedError, Users>;

export class GetUsersUseCase implements UseCase<GetUsersDTO, Promise<Response>> {
  constructor(@OrmRepository() private userRepo: UserRepository) {}

  public async execute(request: GetUsersDTO): Promise<Response> {
    try {
      const toUsersDTO = (users: User[]) => Promise.all(users.map(u => UserMap.toDTO(u)));

      if ((request as FindByUserOptions).userName) {
        const result = await this.userRepo.findBy({ userName: (request as FindByUserOptions).userName });

        return E.right({ users: await toUsersDTO(result.entities), total: result.total });
      }
      const { entities, total } = await this.userRepo.findAll({ pagination: (request as FindOptions).paginationArgs });

      return E.right({ users: await toUsersDTO(entities), total });
    } catch (err) {
      return E.left(new AppError.UnexpectedError(err));
    }
  }
}
