import R from 'ramda';
import { combineActionReducers } from 'brookjs';
import { RUN } from '../actions';
import { lName, lOpts, lOptsEnv, lArgs } from '../lenses';

const isDevStorybookCommand = state =>
    state.name === 'dev' && state.args.type === 'storybook';

const defaults = {};

const cond = [
    [RUN, (state, { payload }) => R.pipe(
        R.set(lName, payload.command),
        R.set(lOpts, payload.options),
        R.set(lArgs, payload.args),
        R.when(isDevStorybookCommand, R.set(lOptsEnv, 'development'))
    )(state)]
];

export default combineActionReducers(cond, defaults);
