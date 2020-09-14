import { EddyReducer } from 'brookjs-eddy';
import { getType } from 'typesafe-actions';
import { RootAction } from '../types';
import * as actions from './actions';
import { State } from './types';

export const reducer: EddyReducer<State, RootAction> = (
  state: State = { status: 'idle' },
  action: RootAction,
) => {
  switch (state.status) {
    case 'idle':
      switch (action.type) {
        case getType(actions.build.request):
        case getType(actions.start.request):
          return {
            status: 'running',
            building: true,
            serverStarted: false,
            results: null,
            watch: action.payload.watch,
          } as const;
        default:
          return state;
      }
    case 'running':
      switch (action.type) {
        case getType(actions.build.success):
          return {
            ...state,
            building: false,
            results: action.payload,
          } as const;
        case getType(actions.build.failure):
          return {
            ...state,
            building: false,
            results: action.payload,
          } as const;
        case getType(actions.start.failure):
          return { ...state, results: action.payload };
        case getType(actions.start.success):
          return {
            ...state,
            building: true,
            serverStarted: true,
          };
        case getType(actions.invalidated):
          return {
            ...state,
            building: true,
          };
        case getType(actions.done):
          return {
            ...state,
            building: false,
            stats: action.payload,
          };
        default:
          return state;
      }
    default:
      return state;
  }
};
