import { getType } from 'typesafe-actions';
import * as webpack from '../../webpack';
import { State, Action } from './types';

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case getType(webpack.actions.build.request):
      return state;
    case getType(webpack.actions.build.success):
      return {
        ...state,
        building: false,
        results: action.payload
      };
    case getType(webpack.actions.build.failure):
      return {
        ...state,
        building: false,
        results: action.payload
      };
    default:
      return state;
  }
};

export default reducer;
