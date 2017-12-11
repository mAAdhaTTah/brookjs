import R from 'ramda';
import { combineActionReducers } from 'brookjs';
import { READ_RC_FILE } from '../actions';

const defaults = {
    reporter: 'spec',
    ui: 'bdd',
    requires: []
};

const cond = [
    [READ_RC_FILE, (state, { payload }) => ({
        ...state,
        reporter: R.defaultTo(defaults.reporter, R.path(['mocha', 'reporter'], payload)),
        ui: R.defaultTo(defaults.ui, R.path(['mocha', 'ui'], payload)),
        requires: R.defaultTo(defaults.requires, R.path(['mocha', 'requires'], payload))
    })]
];

export default combineActionReducers(cond, defaults);
