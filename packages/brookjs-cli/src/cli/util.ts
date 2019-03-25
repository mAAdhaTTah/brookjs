import { Nullable } from 'typescript-nullable';
import { RC } from './RC';

export const errorToNull = (e: Nullable<RC | Error>): Nullable<RC> => {
  if (e instanceof Error) {
    return null;
  }

  return e;
};
