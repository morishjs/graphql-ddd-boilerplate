import { Either, getOrElse, isLeft, isRight, right } from 'fp-ts/lib/Either';
import { fold, fromNullable } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { all } from 'fp-ts-ramda';

export const exists = (o?: any) => {
  return pipe(
    fromNullable(o),
    fold(
      () => false,
      () => true,
    ),
  );
};

export const isNil = (o: any) => !exists(o);

export function unsafeGetRightValue<T>(result: Either<any, T>): undefined | T {
  return getOrElse(() => {
    return undefined;
  })(result);
}

export const LeftValue = getOrElse(l => {
  return l;
});

export const getIndicesForPagination = (page: number, take: number) => {
  const startIndex = take * page;
  const endIndex = startIndex + take;

  return { startIndex, endIndex };
};

export function allRight(eithers: Array<Either<any, any>>): boolean {
  return all(e => isRight(e), eithers);
}

export function combineEither(eithers: Array<Either<any, any>>): Either<any, any> {
  for (const e of eithers) {
    if (isLeft(e)) {
      return e;
    }
  }

  return right(true);
}
