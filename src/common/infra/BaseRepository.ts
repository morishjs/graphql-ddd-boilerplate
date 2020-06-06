import { Repository } from 'typeorm-plus';
import { IPagination, IPaginationResult } from '../types';
import { fromNullable, map, Option } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import * as A from 'fp-ts/lib/Array';

abstract class BaseRepository<Domain, DAO> extends Repository<DAO> {
  public async findAllByIds(params: { ids: string[] }): Promise<Domain[]> {
    return pipe(
      await this.findByIds(params.ids),
      A.map((dao: DAO) => this.deserialize(dao)),
    );
  }

  public async findAll(params: { pagination?: IPagination }): Promise<IPaginationResult<Domain>> {
    const [entities, total] = await this.createQueryBuilder()
      .paginate(params.pagination?.page, params.pagination?.size)
      .getManyAndCount();

    return { entities: entities.map(e => this.deserialize(e)), total };
  }

  public async findOneById(params: { id: string }): Promise<Option<Domain>> {
    return pipe(
      fromNullable(await this.findOne(params.id)),
      map((model: DAO) => this.deserialize(model)),
    );
  }

  protected abstract deserialize(e: DAO): Domain;
}

export default BaseRepository;
