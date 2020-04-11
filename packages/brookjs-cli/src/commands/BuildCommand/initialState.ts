import { Arguments } from 'yargs';
import webpack from 'webpack';
import { State } from './types';
import { RC } from './RC';

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
  { rc, cwd }: { rc: unknown; cwd: string },
): State => ({
  watch: typeof args.watch === 'boolean' ? args.watch : false,
  building: true,
  results: null,
  env: getEnv(args.env),
  rc: RC.decode(rc).getOrElse({}) as RC,
  cwd,
});

export default initialState;
