import path from 'path';
import R from 'ramda';
import { lCommandName, lCommandNameArg, lCommandTypeArg } from '../lenses';

export const isMakeCommand = R.pipe(R.view(lCommandName), R.equals('make'));
export const selectMakePath = state => path.join(
    R.view(lCommandTypeArg, state) + 's',
    R.view(lCommandNameArg, state) + '.js'
);
export const selectMakeTemplate = state => R.view(lCommandTypeArg, state) + 's/template.hbs.js';
export const selectMakeContext = state => ({
    name: R.view(lCommandNameArg, state)
});
