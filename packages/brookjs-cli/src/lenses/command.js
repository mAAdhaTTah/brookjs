import R from 'ramda';

/**
 * Namespace lens.
 */
export const lCommand = R.lensProp('command');

/**
 * Property lenses.
 */
export const lName = R.lensProp('name');
export const lOpts = R.lensProp('opts');
export const lArgs = R.lensProp('args');

/**
 * Namespace property lenses.
 */
export const lCommandName = R.compose(lCommand, lName);
export const lCommandOpts = R.compose(lCommand, R.lensProp('opts'));
export const lCommandArgs = R.compose(lCommand, R.lensProp('args'));
