import R from 'ramda';
import { combineActionReducers } from 'brookjs';
import { READ_ENV, READ_RC_FILE } from '../actions';
import { lCwd, lDir } from '../lenses';

const defaults = {
    cwd: '',
    dir: ''
};

const cond = [
    [READ_ENV, (state, { payload }) => R.pipe(
        R.set(lCwd, payload.cwd)
    )(state)],
    [READ_RC_FILE, (state, { payload }) => R.pipe(
        R.set(lDir, payload.dir)
    )(state)]
];

export default combineActionReducers(cond, defaults);
