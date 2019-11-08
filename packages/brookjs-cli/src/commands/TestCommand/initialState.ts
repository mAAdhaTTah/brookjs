import { Nullable } from 'typescript-nullable';
import { Arguments } from 'yargs';
import { RC } from '../../cli';
import { State, Args } from './types';

const getEnv = (env: unknown): string => {
  if (typeof env === 'string') {
    return env;
  }

  return 'test';
};

const initialState = (
  args: Arguments<Args>,
  { rc, cwd }: { rc: Nullable<RC | Error>; cwd: string }
): State => ({
  rc,
  cwd,
  env: getEnv(args.env),
  coverage: args.coverage === true,
  watch: args.watch === true,
  status: 'running'
});

export default initialState;
