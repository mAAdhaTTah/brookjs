import { ActionType } from 'typesafe-actions';
import { Stats, Configuration } from 'webpack';
import { Maybe } from 'brookjs-types';
import { RC } from './RC';
import * as webpack from '../../webpack';

interface BaseState {
  env: Required<Configuration>['mode'];
  cwd: string;
  rc: Maybe<RC>;
  watch: boolean;
}

interface BuildingState extends BaseState {
  building: true;
  results: null;
}

interface BuildSuccessState extends BaseState {
  building: false;
  results: Stats;
}

interface BuildErrorState extends BaseState {
  building: false;
  results: Error;
}

export type State = BuildingState | BuildSuccessState | BuildErrorState;
export type Action = ActionType<typeof webpack.actions>;
export type Args = {};
