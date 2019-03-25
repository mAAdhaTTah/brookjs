import { ActionType } from 'typesafe-actions';
import { Nullable } from 'typescript-nullable';
import { RC } from '../../cli';
import * as actions from './actions';

interface BaseState {
  rc: Nullable<RC | Error>;
  cwd: string;
  env: string;
  coverage: boolean;
  watch: boolean;
  command: Nullable<string>;
}

export interface IncompleteState extends BaseState {
  code: null;
  out: null;
  err: null;
}

export interface CompleteState extends BaseState {
  code: number;
  out: string;
  err: Nullable<string>;
}

export type State = IncompleteState | CompleteState;
export type Action = ActionType<typeof actions>;
export type Args = {};
