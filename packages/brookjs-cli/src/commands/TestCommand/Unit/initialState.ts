import { Arguments } from 'yargs';
import { State, Args } from './types';
import { RC } from './RC';

const getEnv = (env: unknown): string => {
  if (typeof env === 'string') {
    return env;
  }

  return 'test';
};

const initialState = (
  args: Arguments<Args>,
  { rc, cwd }: { rc: unknown; cwd: string },
): State => ({
  rc: RC.decode(rc).getOrElse({}),
  cwd,
  env: getEnv(args.env),
  coverage: args.coverage === true,
  watch: args.watch === true,
  updateSnapshot: args.updateSnapshot === true,
  status: 'running',
});

export default initialState;
