import { CLIEngine } from 'eslint';
import Kefir, { Stream, Observable } from 'kefir';
import { createAsyncAction, ActionType } from 'typesafe-actions';
import { Delta } from 'brookjs-types';
import { sampleByAction } from 'brookjs-flow';
import { service as fs } from '../fs';

export const actions = {
  project: createAsyncAction(
    'LINT_PROJECT_REQUESTED',
    'LINT_PROJECT_SUCCEEDED',
    'LINT_PROJECT_FAILED',
  )<void, void, void>(),
  file: createAsyncAction(
    'LINT_FILE_REQUESTED',
    'LINT_FILE_SUCCEEDED',
    'LINT_FILE_FAILED',
  )<
    void,
    { path: string; report: CLIEngine.LintReport },
    { path: string; error: Error }
  >(),
};

type State = {
  cwd: string;
  paths: string[];
};

type Action = ActionType<typeof actions>;

export const delta: Delta<Action, State> = (action$, state$) => {
  return state$
    .thru(sampleByAction(action$, actions.project.request))
    .flatMap(state => {
      const eslint = ESLintService.create({ cwd: state.cwd, fix: false });

      return Kefir.concat<Action, never>([
        Kefir.merge(
          state.paths.map(path =>
            eslint
              .check(path)
              .map(report => actions.file.success({ path, report }))
              .flatMapErrors(error =>
                Kefir.constant(actions.file.failure({ path, error })),
              ),
          ),
        ),
        Kefir.constant(actions.project.success()),
      ]);
    });
};

export class ESLintService {
  private engine: CLIEngine;

  static create(opts: { cwd: string; fix: boolean }) {
    return new ESLintService(opts);
  }

  private constructor({ cwd, fix }: { cwd: string; fix: boolean }) {
    this.engine = new CLIEngine({
      baseConfig: {
        extends: 'brookjs',
      },
      cwd,
      extensions: ['js', 'jsx', 'mjs', 'ts', 'tsx'],
      fix,
      reportUnusedDisableDirectives: true,
      useEslintrc: false,
    });
  }

  check(
    path: string,
    buffer?: Buffer | string,
  ): Stream<CLIEngine.LintReport, Error> {
    const buffer$: Observable<string, NodeJS.ErrnoException> =
      buffer != null
        ? Kefir.constant(
            typeof buffer === 'string' ? buffer : buffer.toString('utf-8'),
          )
        : fs.readFile(path).map(buffer => buffer.toString('utf-8'));

    return buffer$.map(contents => this.engine.executeOnText(contents, path));
  }
}
