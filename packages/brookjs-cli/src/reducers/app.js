import R from 'ramda';
import { combineActionReducers } from 'brookjs';
import { INIT_CONFIG_RESPONSE } from '../actions';
import { lName, lDir, lAuthor, lVersion,
    lDescription, lKeywords, lLicense } from '../lenses';

const defaults = {
    name: '',
    dir: 'src',
    author: '',
    version: '0.0.0',
    description: '',
    keywords: [],
    license: 'ISC'
};

const cond = [
    [INIT_CONFIG_RESPONSE, (state, { payload }) => R.pipe(
        R.set(lName, payload.name),
        R.set(lDir, payload.dir),
        R.set(lAuthor, payload.author),
        R.set(lVersion, payload.version),
        R.set(lDescription, payload.description),
        R.set(lKeywords, payload.keywords),
        R.set(lLicense, payload.license)
    )(state)]
];

export default combineActionReducers(cond, defaults);
