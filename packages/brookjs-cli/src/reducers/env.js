import R from 'ramda';
import { combineActionReducers } from 'brookjs';
import { READ_ENV } from '../actions';

const defaults = {
    cwd: ''
};

const cond = [
    [READ_ENV, (state, { payload }) => R.merge(state, {
        cwd: payload.cwd
    })]
];

export default combineActionReducers(cond, defaults);
