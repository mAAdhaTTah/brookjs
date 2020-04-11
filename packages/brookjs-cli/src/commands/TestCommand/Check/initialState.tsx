import { State, RC } from './types';

export const initialState = (cwd: string, rc: unknown): State => ({
  status: 'globbing',
  files: [],
  cwd,
  rc: RC.decode(rc).fold(
    () => null,
    rc => rc,
  ),
});
