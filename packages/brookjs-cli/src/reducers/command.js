import R from 'ramda';
import { combineActionReducers } from 'brookjs';
import { RUN } from '../actions';

const defaults = {};

const cond = [
    [RUN, (state, { payload }) => R.merge(state, {
        name: payload.command,
        opts: payload.options,
        args: payload.args
    })]
];

export default combineActionReducers(cond, defaults);
