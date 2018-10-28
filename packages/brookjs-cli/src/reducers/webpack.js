import R from 'ramda';
import { handleActions } from 'redux-actions';
import { READ_RC_FILE } from '../actions';
import { lEntry, lOutput, lModifier } from '../lenses';

const defaults = {
    entry: {
        app: 'app.js'
    },
    output: {
        path: 'dist/',
        filename: '[name].js'
    },
    modifier: x => x
};

const cond = {
    [READ_RC_FILE]: (state, { payload }) => R.pipe(
        R.set(lEntry, R.defaultTo(defaults.entry, R.path(['webpack', 'entry'], payload))),
        R.set(lOutput, R.defaultTo(defaults.output, R.path(['webpack', 'output'], payload))),
        R.set(lModifier, R.defaultTo(defaults.modifier, R.path(['webpack', 'modifier'], payload))),
    )(state)
};

export default handleActions(cond, defaults);
