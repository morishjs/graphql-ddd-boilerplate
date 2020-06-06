import _ from 'lodash';
import { ObjectLiteral } from '../types';

export enum SortOptions {
  'ASC' = 'ASC',
  'DESC' = 'DESC',
}

export function sortedCountBy<A>(fa: A[], propName: string, sortOptions: SortOptions): ObjectLiteral {
  let iter = o => o[1];
  if (sortOptions === SortOptions.DESC) {
    iter = o => -o[1];
  }

  const propWithCount = _.countBy(fa, propName);
  return _.fromPairs(_.sortBy(_.toPairs(propWithCount), [iter]));
}
