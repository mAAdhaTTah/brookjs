import R from 'ramda';
import { handleActions } from 'redux-actions';
import { READ_ENV } from '../actions';
import { lCwd } from '../lenses';

const defaults = {
    cwd: ''
};

const cond = {
    [READ_ENV]: (state, { payload }) => R.pipe(
        R.set(lCwd, payload.cwd)
    )(state)
};

export default handleActions(cond, defaults);
