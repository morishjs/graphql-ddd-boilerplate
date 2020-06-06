import * as t from 'io-ts';

export const getErrorPaths = (errors: t.Errors): string => {
  return errors.map(error => error.context.map(({ key, actual }) => `key: ${key}, actual: ${actual}`)).join(' / ');
};
