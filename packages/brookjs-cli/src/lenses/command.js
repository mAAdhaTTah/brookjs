import R from 'ramda';
import { lName, lOpts, lArgs } from './properties';

/**
 * Namespace lens.
 */
export const nslCommand = R.lensProp('command');

/**
 * Namespace property lenses.
 */
export const lCommandName = R.compose(nslCommand, lName);
export const lCommandOpts = R.compose(nslCommand, lOpts);
export const lCommandArgs = R.compose(nslCommand, lArgs);
