import R from 'ramda';

/**
 * Namespace lens.
 */
export const lEnv = R.lensProp('env');

/**
 * Property lenses.
 */
export const lCwd = R.lensProp('cwd');

/**
 * Namespace property lenses.
 */
export const lEnvCwd = R.compose(lEnv, lCwd);
