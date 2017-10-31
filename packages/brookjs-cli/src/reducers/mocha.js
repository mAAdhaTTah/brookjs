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
        reporter: R.defaultTo(defaults.reporter, payload.mocha.reporter),
        ui: R.defaultTo(defaults.ui, payload.mocha.ui),
        requires: R.defaultTo(defaults.requires, payload.mocha.requires)
    })]
];

export default combineActionReducers(cond, defaults);
