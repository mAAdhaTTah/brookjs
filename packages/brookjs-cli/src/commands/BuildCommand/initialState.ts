import { Arguments } from 'yargs';
import { Nullable } from 'typescript-nullable';
import webpack from 'webpack';
import { RC } from '../../cli';
import { State } from './types';

const getEnv = (env: unknown): webpack.Configuration['mode'] => {
  if (
    typeof env === 'string' &&
    (env === 'production' || env === 'development' || env === 'none')
  ) {
    return env;
  }

  return 'production';
};

const initialState = (
  args: Arguments,
  { rc, cwd }: { rc: Nullable<RC | Error>; cwd: string }
): State => ({
  building: true,
  results: null,
  env: getEnv(args.env),
  rc: Nullable.withDefault(null, rc),
  cwd
});

export default initialState;
