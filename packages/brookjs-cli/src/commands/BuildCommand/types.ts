import { ActionType } from 'typesafe-actions';
import { Stats, Configuration } from 'webpack';
import { Maybe } from 'brookjs-types';
import * as webpack from '../../webpack';
import { Ext } from '../../project';
import { project } from '../..';
import { RC } from './RC';

interface BaseState {
  env: Required<Configuration>['mode'];
  cwd: string;
  rc: Maybe<RC>;
  watch: boolean;
  extension?: Ext;
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
export type Action = ActionType<
  typeof webpack.actions & typeof project.actions
>;
export type Args = {};
