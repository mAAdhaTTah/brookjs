import R from 'ramda';
import { lCwd } from './properties';

/**
 * Namespace lens.
 */
export const nslEnv = R.lensProp('env');

/**
 * Namespace property lenses.
 */
export const lEnvCwd = R.compose(nslEnv, lCwd);
