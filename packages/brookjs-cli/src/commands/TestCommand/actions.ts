import { createAsyncAction } from 'typesafe-actions';

export const shellCommand = createAsyncAction(
  'SHELL_COMMAND_EXEC',
  'SHELL_COMMAND_SUCCESS',
  'SHELL_COMMAND_ERROR'
)<
  string,
  { stdout: string },
  { stdout: string; stderr: string; code: number }
>();
