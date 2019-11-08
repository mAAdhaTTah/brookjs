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
}

export interface RunningState extends BaseState {
  status: 'running'
}

export interface CompleteState extends BaseState {
  status: 'complete'
}

export interface ErrorState extends BaseState {
  status: 'error'
}

export type State = RunningState | CompleteState | ErrorState;
export type Action = ActionType<typeof actions>;
export type Args = {
  coverage: boolean;
  watch: boolean;
};
