import * as t from 'io-ts';
import { Maybe } from 'brookjs-types';
import { ActionType } from 'typesafe-actions';
import * as glob from '../../../glob';
import * as prettier from '../../../prettier';

export const RC = t.partial({
  dir: t.string,
});

export type RC = t.TypeOf<typeof RC>;

export type Args = {};

export type FileCheck =
  | {
      path: string;
      status: 'unchecked';
    }
  | {
      path: string;
      status: 'checked';
      correct: boolean;
    }
  | {
      path: string;
      status: 'errored';
      error: Error;
    };

export type State = {
  status: 'globbing' | 'checking' | 'completed';
  cwd: string;
  rc: Maybe<RC>;
  files: FileCheck[];
};

export type Action = ActionType<typeof prettier.actions & typeof glob.actions>;
