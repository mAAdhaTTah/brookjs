import { getType } from 'typesafe-actions';
import { EddyReducer, loop } from 'brookjs';
import * as glob from '../../../glob';
import { State, Action } from './types';
import { initialState } from './initialState';
import { check } from './actions';

export const reducer: EddyReducer<State, Action> = (
  state = initialState('/', null),
  action
) => {
  switch (action.type) {
    case getType(glob.actions.lint.success):
      return loop(
        {
          ...state,
          files: action.payload.map(path => ({ path, status: 'unchecked' }))
        },
        [check.project.request()]
      );
    case getType(check.project.request):
      return {
        ...state,
        status: 'checking'
      };
    case getType(check.project.success):
      return {
        ...state,
        status: 'completed'
      };
    case getType(check.file.success):
      return {
        ...state,
        files: state.files.map(file =>
          file.path === action.payload.path
            ? { ...file, status: 'checked', correct: action.payload.correct }
            : file
        )
      };
    case getType(check.file.failure):
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
