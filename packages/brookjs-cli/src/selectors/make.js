import path from 'path';
import R from 'ramda';
import { lCommandName, lCommandNameArg, lCommandTypeArg,
    lCommandFileOpts } from '../lenses';

export const isMakeCommand = R.pipe(R.view(lCommandName), R.equals('make'));
export const selectBarrelPath = state => path.join(
    R.view(lCommandTypeArg, state) + 's',
    'index.js'
);
export const selectExportTemplate = state => path.join(
    R.view(lCommandTypeArg, state) + 's',
    'export.hbs.js'
);
export const selectMakeContext = state => ({
    name: R.view(lCommandNameArg, state),
    file: R.view(lCommandFileOpts, state)
});

export const selectFilePath = state => path.join(
    R.view(lCommandTypeArg, state) + 's',
    R.view(lCommandFileOpts, state) + '.js'
);
export const selectInstanceTemplate = state => path.join(
    R.view(lCommandTypeArg, state) + 's',
    'instance.hbs.js'
);
