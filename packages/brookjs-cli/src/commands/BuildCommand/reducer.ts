import { getType } from 'typesafe-actions';
import { State, Action } from './types';
import { webpackBuild } from './actions';

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case getType(webpackBuild.request):
      return state;
    case getType(webpackBuild.success):
      return {
        ...state,
        building: false,
        results: action.payload
      };
    case getType(webpackBuild.failure):
      return {
        ...state,
        building: false,
        results: action.payload
      };
  }
};

export default reducer;
