import { getType } from 'typesafe-actions';
import { State, Action } from './types';
import { testRun } from './actions';

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case getType(testRun.request):
      return state;
    case getType(testRun.success):
      return {
        ...state,
        status: 'complete'
      };
    case getType(testRun.failure):
      return {
        ...state,
        status: 'error'
      };
  }
};

export default reducer;
