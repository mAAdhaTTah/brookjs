import { ActionType } from 'typesafe-actions';
import { Maybe, RCResult } from '../../cli';
import * as actions from './actions';

interface BaseState {
  rc: Maybe<RCResult>;
  cwd: string;
  env: string;
  coverage: boolean;
  watch: boolean;
}

export interface RunningState extends BaseState {
  status: 'running';
}

export interface CompleteState extends BaseState {
  status: 'complete';
}

export interface ErrorState extends BaseState {
  status: 'error';
}

export type State = RunningState | CompleteState | ErrorState;
export type Action = ActionType<typeof actions>;
export type Args = {
  coverage: boolean;
  watch: boolean;
};
