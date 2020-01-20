import { Observable } from 'kefir';
import prettier from 'prettier';
import prettierOptions from 'brookjs-prettier-config';
import { service as fs } from '../fs';

export type CheckResult = {
  path: string;
  correct: boolean;
};

export type CheckError = {
  path: string;
  error: Error;
};

export const check = (path: string): Observable<CheckResult, CheckError> =>
  fs
    .readFile(path)
    .map(buffer => ({
      path,
      correct: prettier.check(buffer.toString('utf-8'), {
        ...prettierOptions,
        filepath: path
      })
    }))
    .mapErrors(error => ({
      path,
      error
    }));
