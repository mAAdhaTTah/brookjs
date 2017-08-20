import path from 'path';
import R from 'ramda';
import { lApp, lAppAuthor, lAppDescription, lAppDir,
    lAppLicense, lAppName, lAppVersion } from '../lenses';

export const selectConfirmMessage  = state =>
    `Confirm your app configuration:

${JSON.stringify(R.view(lApp, state), null, '  ')}

Is this ok?`;

export const selectRoot = state =>
    path.join(state.env.cwd, R.view(lAppName, state));

export const selectPkgContext = R.applySpec({
    name: R.view(lAppName),
    version: R.view(lAppVersion),
    description: R.view(lAppDescription),
    main: state => path.join(R.view(lAppDir, state), 'app.js'),
    author: R.view(lAppAuthor),
    license: R.view(lAppLicense),
});

export const selectRcContext = R.applySpec({
    dir: R.view(lAppDir)
});

export const selectAppJsContext = R.applySpec({
    name: R.view(lAppName)
});
