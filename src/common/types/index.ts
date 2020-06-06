import * as t from 'io-ts';

/**
 * Interface of the simple literal object with any string keys.
 */
export interface ObjectLiteral {
  [key: string]: any;
}

export interface IPagination {
  page?: number;
  size?: number;
}

export interface IPaginationResult<T> {
  total: number;
  entities: T[];
}

export const Nullable = t.union([t.null, t.undefined]);
