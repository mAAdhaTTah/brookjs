import webpack from 'webpack';
import { createAsyncAction, createAction } from 'typesafe-actions';

export const build = createAsyncAction(
  'WEBPACK_BUILD_REQUESTED',
  'WEBPACK_BUILD_COMPLETED',
  'WEBPACK_BUILD_FAILED'
)<void, webpack.Stats, Error>();

export const start = createAsyncAction(
  'WEBPACK_START_REQUESTED',
  'WEBPACK_START_COMPLETED',
  'WEBPACK_START_FAILED'
)<void, { success: true }, Error>();

export const invalidated = createAction('WEBPACK_INVALIDATED')<{
  what: string;
  when: Date;
}>();

export const done = createAction('WEBPACK_BUILD_DONE')<webpack.Stats>();
