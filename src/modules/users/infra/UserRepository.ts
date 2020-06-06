import { EntityRepository } from 'typeorm-plus';
import { User as DAO } from 'modules/users/infra/User';
import UserMap from 'modules/users/mappers/UserMap';
import { User } from 'modules/users/domain/User';
import { exists } from 'common/logics';
import { IPaginationResult } from '../../../common/types';
import { UserWithdrawn } from '../domain/events';
import BaseRepository from '../../../common/infra/BaseRepository';
import { pipe } from 'fp-ts/lib/pipeable';
import { fromNullable, map, Option } from 'fp-ts/lib/Option';

interface IFindOptions {
  email?: string;
  userName?: string;
}

interface IFindOneOptions {
  email?: string;
}

@EntityRepository(DAO)
export class UserRepository extends BaseRepository<User, DAO> {
  public async checkEmailDuplication(email: string): Promise<boolean> {
    const user = await super.findOne({ where: { email } });

    return exists(user);
  }

  public async checkPhoneDuplication(phone: string): Promise<boolean> {
    const user = await super.findOne({ where: { phone } });

    return exists(user);
  }

  public async removeOne(user: User): Promise<void> {
    await super.delete(user.id.toString());

    user.addDomainEvent(
      UserWithdrawn(),
      {
        userId: user.id.toString(),
      },
      'UserWithdrawn',
    );
  }

  public async saveOne(user: User): Promise<void> {
    const dao = await UserMap.toPersistence(user);
    await super.save(dao);
  }

  public async findBy(param: IFindOptions): Promise<IPaginationResult<User>> {
    const users = await this.find({ where: param });
    return { entities: users.map(u => this.deserialize(u)), total: users.length };
  }

  public async findOneBy(param: IFindOneOptions): Promise<Option<User>> {
    const this_ = this;
    return pipe(
      await this.findOne({ where: param }),
      fromNullable,
      map((u: DAO) => this_.deserialize(u)),
    );
  }

  protected deserialize(e: DAO): User {
    return UserMap.persistenceToDomain(e);
  }
}
