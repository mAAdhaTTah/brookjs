import { createAsyncAction } from 'typesafe-actions';
import webpack from 'webpack';

export const webpackBuild = createAsyncAction(
  'WEBPACK_BUILD_STARTED',
  'WEBPACK_BUILD_COMPLETED',
  'WEBPACK_BUILD_FAILED'
)<void, webpack.Stats, Error>();
