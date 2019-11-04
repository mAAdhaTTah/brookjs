import { createAsyncAction } from 'typesafe-actions';

export const testRun = createAsyncAction(
  'TEST_RUN_REQUESTED',
  'TEST_RUN_SUCCESS',
  'TEST_RUN_ERROR'
)<void, void, void>();
