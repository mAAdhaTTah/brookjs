import Kefir, { Observable } from 'kefir';
import prettier from 'prettier';
import prettierOptions from 'brookjs-prettier-config';
import { createAsyncAction, ActionType } from 'typesafe-actions';
import { sampleByAction } from 'brookjs-flow';
import { Delta } from 'brookjs-types';
import { service as fs } from '../fs';

export type CheckResult = {
  path: string;
  correct: boolean;
};

export type CheckError = {
  path: string;
  error: Error;
};

export type FormatResult = {
  path: string;
  contents: string;
  changed: boolean;
};

export type FormatError = {
  path: string;
  error: Error;
};

export const actions = {
  project: createAsyncAction(
    'CHECK_PROJECT_REQUESTED',
    'CHECK_PROJECT_SUCCEEDED',
    'CHECK_PROJECT_FAILED',
  )<void, void, void>(),
  file: createAsyncAction(
    'CHECK_FILE_REQUESTED',
    'CHECK_FILE_SUCCEEDED',
    'CHECK_FILE_FAILED',
  )<void, CheckResult, CheckError>(),
};

export type Action = ActionType<typeof actions>;
export type State = {
  paths: string[];
};

export const check = (path: string): Observable<CheckResult, CheckError> =>
  fs
    .readFile(path)
    .map(buffer => ({
      path,
      correct: prettier.check(buffer.toString('utf-8'), {
        ...prettierOptions,
        filepath: path,
      }),
    }))
    .mapErrors(error => ({
      path,
      error,
    }));

export const format = (
  path: string,
  buffer?: Buffer,
): Observable<FormatResult, FormatError> => {
  const buffer$: Observable<Buffer, NodeJS.ErrnoException> = buffer
    ? Kefir.constant(buffer)
    : fs.readFile(path);

  return buffer$
    .map(buffer => buffer.toString('utf-8'))
    .flatMap(contents => {
      const formatted = prettier.format(contents, {
        ...prettierOptions,
        filepath: path,
      });

      if (contents === formatted) {
        return Kefir.constant({
          path,
          contents,
          changed: false,
        });
      }

      const result = { path, contents: formatted, changed: true };

      if (buffer) {
        return Kefir.constant(result);
      }

      return fs.writeFile(path, contents).map(() => result);
    })
    .mapErrors(error => ({
      path,
      error,
    }));
};

export const delta: Delta<Action, State> = (action$, state$) =>
  state$.thru(sampleByAction(action$, actions.project.request)).flatMap(state =>
    Kefir.concat<Action, never>([
      Kefir.merge(state.paths.map(path => check(path)))
        .map(result => actions.file.success(result))
        .flatMapErrors(error => Kefir.constant(actions.file.failure(error))),
      Kefir.constant(actions.project.success()),
    ]),
  );
