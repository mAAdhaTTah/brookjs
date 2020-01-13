import { createAsyncAction } from 'typesafe-actions';
import { CLIEngine } from 'eslint';

export const lint = {
  project: createAsyncAction(
    'LINT_PROJECT_REQUESTED',
    'LINT_PROJECT_SUCCEEDED',
    'LINT_PROJECT_FAILED'
  )<void, void, void>(),
  file: createAsyncAction(
    'LINT_FILE_REQUESTED',
    'LINT_FILE_SUCCEEDED',
    'LINT_FILE_FAILED'
  )<
    void,
    { path: string; report: CLIEngine.LintReport },
    { path: string; error: Error }
  >()
};
