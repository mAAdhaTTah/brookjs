import R from 'ramda';
import { handleActions } from 'redux-actions';
import { INIT_CONFIG_RESPONSE, READ_RC_FILE } from '../actions';
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

const cond = {
    [INIT_CONFIG_RESPONSE]: (state, { payload }) => R.pipe(
        R.set(lName, payload.name),
        R.set(lDir, payload.dir),
        R.set(lAuthor, payload.author),
        R.set(lVersion, payload.version),
        R.set(lDescription, payload.description),
        R.set(lKeywords, payload.keywords),
        R.set(lLicense, payload.license)
    )(state),
    [READ_RC_FILE]: (state, { payload }) => R.pipe(
        R.set(lDir, payload.dir)
    )(state)
};

export default handleActions(cond, defaults);
