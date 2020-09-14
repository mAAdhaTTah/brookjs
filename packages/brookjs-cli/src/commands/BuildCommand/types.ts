import { ActionType, StateType } from 'typesafe-actions';
import * as webpack from '../../webpack';
import * as project from '../../project';
import reducer from './reducer';

export type State = StateType<typeof reducer>[0];
export type Action = ActionType<
  typeof webpack.actions & typeof project.actions
>;
export type Args = {};
