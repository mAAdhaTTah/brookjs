import { createAsyncAction } from 'typesafe-actions';
import { prettier } from '../../../services';

export const check = {
  project: createAsyncAction(
    'CHECK_PROJECT_STARTED',
    'CHECK_PROJECT_SUCCEEDED',
    'CHECK_PROJECT_FAILED'
  )<void, void, void>(),
  file: createAsyncAction(
    'CHECK_FILE_STARTED',
    'CHECK_FILE_SUCCEEDED',
    'CHECK_FILE_FAILED'
  )<void, prettier.CheckResult, prettier.CheckError>()
};
