import R from 'ramda';
import { combineActionReducers } from 'brookjs';
import { RUN } from '../actions';
import { lName, lOpts, lArgs } from '../lenses';

const defaults = {};

const cond = [
    [RUN, (state, { payload }) => R.pipe(
        R.set(lName, payload.command),
        R.set(lOpts, payload.options),
        R.set(lArgs, payload.args)
    )(state)]
];

export default combineActionReducers(cond, defaults);
