import { ActionType } from 'typesafe-actions';
import webpack from 'webpack';
import { RC, Maybe } from '../../cli';
import * as actions from './actions';

interface BaseState {
  env: Required<webpack.Configuration>['mode'];
  cwd: string;
  rc: Maybe<RC | Error>;
  watch: boolean;
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
