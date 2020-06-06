import { AsyncEvent } from 'ts-events';
import { IO } from 'fp-ts/lib/IO';

interface IUserWithdrawn {
  userId: string;
}

export const UserWithdrawn: IO<AsyncEvent<IUserWithdrawn>> = () => {
  const event = new AsyncEvent<IUserWithdrawn>();

  event.once((data: IUserWithdrawn) => {
    console.log(`User (${data.userId}) withdrawn`);
  });

  return event;
};
