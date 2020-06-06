import { allRight, combineEither, exists, isNil, unsafeGetRightValue } from 'common/logics/index';
import { left, right } from 'fp-ts/lib/Either';

describe('logics', () => {
  test('exists: should return true if the param is `non-undefined`', () => {
    expect(exists({})).toBeTruthy();
  });

  test('isNil: should return true if the param is `undefined`', () => {
    expect(isNil(undefined)).toBeTruthy();
  });

  test('unsafeGetRightValue: should return the value', () => {
    expect(unsafeGetRightValue(right(1))).toBe(1);
  });

  test('unsafeGetRightValue: should return `undefined` if the input is left', () => {
    expect(unsafeGetRightValue(left(undefined))).toBe(undefined);
  });

  test('allRight: should return true if all `eithers` are right', () => {
    expect(allRight([right(1), right(2)])).toBe(true);
  });

  test('allRight: should return false if some `eithers` are not right', () => {
    expect(allRight([left(1), right(2)])).toBe(false);
  });

  test('combineEither: should return left if some `eithers` are not right', () => {
    expect(combineEither([left(1), right(2)])).toMatchObject(left(1));
  });
});
