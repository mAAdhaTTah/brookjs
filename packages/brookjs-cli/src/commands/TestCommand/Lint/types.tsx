import { Maybe } from 'brookjs-types';
import { ActionType } from 'typesafe-actions';
import * as t from 'io-ts';
import { globLint } from '../../../deltas';
import * as actions from './actions';
import { CLIEngine } from 'eslint';

export const RC = t.partial({
  dir: t.string
});
export type RC = t.TypeOf<typeof RC>;
export type FileLint =
  | {
      path: string;
      status: 'unlinted';
    }
  | {
      path: string;
      status: 'linted';
      report: CLIEngine.LintReport;
    }
  | {
      path: string;
      status: 'errored';
      error: Error;
    };
export type State = {
  cwd: string;
  rc: Maybe<RC>;
  status: 'globbing' | 'linting' | 'completed';
  files: FileLint[];
};
export type Action = ActionType<typeof actions & typeof globLint>;
export type Args = {};
