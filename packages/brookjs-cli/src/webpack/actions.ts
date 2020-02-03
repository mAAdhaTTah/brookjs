import webpack from 'webpack';
import { createAsyncAction } from 'typesafe-actions';

export const build = createAsyncAction(
  'WEBPACK_BUILD_REQUESTED',
  'WEBPACK_BUILD_COMPLETED',
  'WEBPACK_BUILD_FAILED'
)<void, webpack.Stats, Error>();
