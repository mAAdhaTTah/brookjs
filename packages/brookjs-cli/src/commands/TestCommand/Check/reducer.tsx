import { getType } from 'typesafe-actions';
import { EddyReducer, loop } from 'brookjs';
import * as glob from '../../../glob';
import * as prettier from '../../../prettier';
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
          files: action.payload.map(path => ({ path, status: 'unchecked' }))
        },
        [prettier.actions.project.request()]
      );
    case getType(prettier.actions.project.request):
      return {
        ...state,
        status: 'checking'
      };
    case getType(prettier.actions.project.success):
      return {
        ...state,
        status: 'completed'
      };
    case getType(prettier.actions.file.success):
      return {
        ...state,
        files: state.files.map(file =>
          file.path === action.payload.path
            ? { ...file, status: 'checked', correct: action.payload.correct }
            : file
        )
      };
    case getType(prettier.actions.file.failure):
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
