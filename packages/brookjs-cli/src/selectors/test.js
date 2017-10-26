import path from 'path';
import R from 'ramda';
import { lAppDir, lCommandName, lCommandArgs, lCommandOpts, lEnvCwd } from '../lenses';

export const isTestCommand = R.pipe(R.view(lCommandName), R.equals('test'));
export const getTestType = R.view(R.compose(lCommandArgs, R.lensProp('type')));
export const getTestReporter = state => `--reporter ${state.mocha.reporter}`;
export const getTestUi = state => `--ui ${state.mocha.ui}`;
export const getTestRequires = state =>
    state.mocha.requires.map(req => `--require ${req}`).join(' ');
export const getTestFilesGlob = state =>
    path.join(R.view(lEnvCwd, state), R.view(lAppDir, state), '**/__tests__/*.spec.js');
export const getCoverage = state =>
    R.view(lCommandOpts, state) ? 'nyc --reporter=html --reporter=text' : '';
export const getMochaCommand = state =>
    `${getCoverage(state)} mocha ${getTestReporter(state)} ${getTestUi(state)} ${getTestRequires(state)} --colors ${getTestFilesGlob(state)}`;
