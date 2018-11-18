import path from 'path';
import R from 'ramda';
import { ofType } from 'brookjs';
import { lAppAuthor, lAppDescription, lAppDir,
    lAppLicense, lAppName, lAppVersion, lEnvCwd, nslApp } from '../lenses';
import { READ_ENV, READ_RC_FILE, RUN } from '../actions';

export * from './build';
export * from './make';
export * from './test';

export const selectConfirmMessage  = state =>
    `Confirm your app configuration:

${JSON.stringify(R.view(nslApp, state), null, '  ')}

Is this ok?`;

export const selectRcPath = state =>
    path.join(R.view(lEnvCwd, state), '.beaverrc.js');

export const selectRoot = state =>
    path.join(state.env.cwd, R.view(lAppName, state));

export const selectNewProjectContext = R.applySpec({
    dir: R.view(lAppDir),
    name: R.view(lAppName),
    version: R.view(lAppVersion),
    description: R.view(lAppDescription),
    main: state => path.join(R.view(lAppDir, state), 'app.js'),
    author: R.pipe(R.view(lAppAuthor), R.defaultTo('')),
    license: R.view(lAppLicense),
});

export const takeStateOnBootstrap = (state$, actions$) =>
    state$.sampledBy(
        actions$.thru(ofType(READ_RC_FILE, READ_ENV, RUN))
            .bufferWithCount(3)
    ).take(1);
