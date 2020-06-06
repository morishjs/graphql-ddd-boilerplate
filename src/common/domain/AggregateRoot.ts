import { Entity } from './Entity';
import { UniqueEntityID } from './UniqueEntityID';
import { BaseEvent } from 'ts-events/dist/lib/base-event';
import { env } from '../../env';

export abstract class AggregateRoot<T> extends Entity<T> {
  get id(): UniqueEntityID {
    return this._id;
  }

  public addDomainEvent<T>(domainEvent: BaseEvent<T>, data: T, eventName?: string): void {
    if (!env.isTest) {
      domainEvent.post(data);
      this.logDomainEventAdded(domainEvent, data, eventName);
    }
  }

  private logDomainEventAdded<T>(domainEvent: BaseEvent<T>, data: T, eventName?: string): void {
    const thisClass = Reflect.getPrototypeOf(this);
    const domainEventClass = Reflect.getPrototypeOf(domainEvent);

    console.info(
      `[Domain Event Created]:`,
      eventName ?? thisClass.constructor.name,
      '==>',
      domainEventClass.constructor.name,
      JSON.stringify(data),
    );
  }
}
