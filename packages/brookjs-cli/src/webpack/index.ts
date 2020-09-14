import webpack from 'webpack';
import * as actions from './actions';

export * from './delta';
export * from './selectors';
export * from './types';
export * from './reducer';

export { actions };

export const getEnv = (
  env: unknown,
): Required<webpack.Configuration>['mode'] => {
  if (
    typeof env === 'string' &&
    (env === 'production' || env === 'development' || env === 'none')
  ) {
    return env;
  }

  return 'production';
};
