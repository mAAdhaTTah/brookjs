import { State, RC } from './types';

export const initialState = (cwd: string, rc: unknown): State => ({
  cwd,
  rc: RC.decode(rc).fold(
    () => null,
    rc => rc
  ),
  status: 'globbing',
  files: []
});
