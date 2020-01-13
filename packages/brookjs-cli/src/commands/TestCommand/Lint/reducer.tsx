import { EddyReducer, loop } from 'brookjs';
import { getType } from 'typesafe-actions';
import { globLint } from '../../../deltas';
import { State, Action } from './types';
import { initialState } from './initialState';
import { lint } from './actions';

export const reducer: EddyReducer<State, Action> = (
  state = initialState('/', null),
  action
) => {
  switch (action.type) {
    case getType(globLint.success):
      return loop(
        {
          ...state,
          files: action.payload.map(path => ({ path, status: 'unlinted' }))
        },
        [lint.project.request()]
      );
    case getType(lint.project.request):
      return {
        ...state,
        status: 'linting'
      };
    case getType(lint.project.success):
      return {
        ...state,
        status: 'completed'
      };
    case getType(lint.file.success):
      return {
        ...state,
        files: state.files.map(file =>
          file.path === action.payload.path
            ? { ...file, status: 'linted', report: action.payload.report }
            : file
        )
      };
    case getType(lint.file.failure):
      return {
        ...state,
        files: state.files.map(file =>
          file.path === action.payload.path
            ? { ...file, status: 'errored', error: action.payload.error }
            : file
        )
      };
    default:
      return state;
  }
};
