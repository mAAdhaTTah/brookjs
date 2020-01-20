import { getType } from 'typesafe-actions';
import { loop, EddyReducer } from 'brookjs';
import * as webpack from '../../webpack';
import * as project from '../../project';
import { State, Action } from './types';
import initialState from './initialState';

const reducer: EddyReducer<State, Action> = (
  state: State = initialState({} as any, {} as any),
  action: Action
) => {
  switch (action.type) {
    case getType(webpack.actions.build.success):
      return {
        ...state,
        building: false,
        results: action.payload
      } as const;
    case getType(webpack.actions.build.failure):
      return {
        ...state,
        building: false,
        results: action.payload
      } as const;
    case getType(project.actions.extension.success):
      return loop(
        {
          ...state,
          extension: action.payload
        },
        webpack.actions.build.request()
      );
    default:
      return state;
  }
};

export default reducer;
