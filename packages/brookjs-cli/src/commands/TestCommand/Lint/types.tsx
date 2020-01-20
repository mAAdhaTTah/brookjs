import { Maybe } from 'brookjs-types';
import { ActionType } from 'typesafe-actions';
import * as t from 'io-ts';
import { CLIEngine } from 'eslint';
import * as glob from '../../../glob';
import * as eslint from '../../../eslint';

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
export type Action = ActionType<typeof glob.actions & typeof eslint.actions>;
export type Args = {};
