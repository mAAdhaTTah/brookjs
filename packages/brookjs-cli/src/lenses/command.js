import R from 'ramda';
import { lName, lOpts, lArgs, lType } from './properties';

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
export const lCommandTypeArg = R.compose(lCommandArgs, lType);
export const lCommandNameArg = R.compose(lCommandArgs, lName);
