import { EddyReducer, loop } from 'brookjs';
import { getType } from 'typesafe-actions';
import * as glob from '../../../glob';
import * as eslint from '../../../eslint';
import { State, Action } from './types';
import { initialState } from './initialState';

export const reducer: EddyReducer<State, Action> = (
  state = initialState('/', null),
  action
) => {
  switch (action.type) {
    case getType(glob.actions.lint.success):
      return loop(
        {
          ...state,
          files: action.payload.map(path => ({ path, status: 'unlinted' }))
        },
        [eslint.actions.project.request()]
      );
    case getType(eslint.actions.project.request):
      return {
        ...state,
        status: 'linting'
      };
    case getType(eslint.actions.project.success):
      return {
        ...state,
        status: 'completed'
      };
    case getType(eslint.actions.file.success):
      return {
        ...state,
        files: state.files.map(file =>
          file.path === action.payload.path
            ? { ...file, status: 'linted', report: action.payload.report }
            : file
        )
      };
    case getType(eslint.actions.file.failure):
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
