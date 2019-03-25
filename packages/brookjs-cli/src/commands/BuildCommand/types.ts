import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import webpack from 'webpack';
import { Nullable } from 'typescript-nullable';
import { RC } from '../../cli';

interface BaseState {
  env: webpack.Configuration['mode'];
  cwd: string;
  rc: Nullable<RC | Error>;
}

interface BuildingState extends BaseState {
  building: true;
  results: null;
}

interface BuildSuccessState extends BaseState {
  building: false;
  results: webpack.Stats;
}

interface BuildErrorState extends BaseState {
  building: false;
  results: Error;
}

export type State = BuildingState | BuildSuccessState | BuildErrorState;
export type Action = ActionType<typeof actions>;
export type Args = {};
