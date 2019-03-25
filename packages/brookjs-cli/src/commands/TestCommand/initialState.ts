import { RC } from '../../cli';
import { State } from './types';
import { Arguments } from 'yargs';
import { Nullable } from 'typescript-nullable';

const getEnv = (env: unknown): string => {
  if (typeof env === 'string') {
    return env;
  }

  return 'test';
};

const initialState = (
  args: Arguments,
  { rc, cwd }: { rc: Nullable<RC | Error>; cwd: string }
): State => ({
  rc,
  cwd,
  env: getEnv(args.env),
  coverage: args.coverage === true,
  watch: args.watch === true,
  command: null,
  code: null,
  out: null,
  err: null
});

export default initialState;
