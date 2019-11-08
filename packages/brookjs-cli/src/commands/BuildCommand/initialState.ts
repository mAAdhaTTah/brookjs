import { Arguments } from 'yargs';
import webpack from 'webpack';
import { RC, Maybe } from '../../cli';
import { State } from './types';

const getEnv = (env: unknown): Required<webpack.Configuration>['mode'] => {
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
  { rc, cwd }: { rc: Maybe<RC | Error>; cwd: string }
): State => ({
  watch: typeof args.watch === 'boolean' ? args.watch : false,
  building: true,
  results: null,
  env: getEnv(args.env),
  rc: rc ?? null,
  cwd
});

export default initialState;
