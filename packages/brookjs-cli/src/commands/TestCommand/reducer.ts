import { getType } from 'typesafe-actions';
import { State, Action } from './types';
import { shellCommand } from './actions';

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case getType(shellCommand.request):
      return {
        ...state,
        command: action.payload
      };
    case getType(shellCommand.success):
      return {
        ...state,
        code: 0,
        out: action.payload.stdout
      };
    case getType(shellCommand.failure):
      return {
        ...state,
        code: action.payload.code,
        out: action.payload.stdout,
        err: action.payload.stderr
      };
  }
};

export default reducer;
