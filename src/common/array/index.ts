import { compact, map, isEmpty, dropLeft, takeLeft } from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/pipeable';
import { fromNullable, map as optionMap } from 'fp-ts/lib/Option';

export function mapCompact<A, B>(f: (a: A) => B, arr: A[]): B[] {
  return pipe(
    arr,
    map((a: A) => optionMap(f)(fromNullable(a))),
    compact,
  );
}

export function pagination<A>(arr: A[], options?: { page?: number; limit?: number }): A[] {
  if (isEmpty(arr)) {
    return [];
  }

  const limit = options?.limit ?? 25;
  const offset = options?.page ? limit * options.page : 0;

  return pipe(arr, dropLeft(offset), takeLeft(limit));
}
