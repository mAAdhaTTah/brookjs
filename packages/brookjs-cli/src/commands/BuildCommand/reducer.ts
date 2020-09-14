import { combineReducers } from 'brookjs-eddy';
import {
  reducer as webpackReducer,
  State as WebpackState,
  Action as WebpackAction,
} from '../../webpack';
import {
  reducer as projectReducer,
  State as ProjectState,
  Action as ProjectAction,
} from '../../project';

const reducer = combineReducers<
  {
    project: ProjectState;
    webpack: WebpackState;
  },
  WebpackAction | ProjectAction
>({
  project: projectReducer,
  webpack: webpackReducer,
});

export default reducer;
