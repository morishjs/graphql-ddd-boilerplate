import { AggregateRoot } from './AggregateRoot';
import { DomainService } from './DomainService';
import { Entity } from './Entity';
import { UniqueEntityID } from './UniqueEntityID';
import { ValueObject } from './ValueObject';
import { WatchedList } from './WatchedList';

interface UseCase<IRequest, IResponse> {
  execute(request?: IRequest): Promise<IResponse> | IResponse;
}

export { AggregateRoot, DomainService, Entity, UniqueEntityID, ValueObject, WatchedList, UseCase };
