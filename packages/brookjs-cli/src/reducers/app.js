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

const mapPayloadToSetter = R.converge((...funcs) => R.pipe(...funcs), [
    R.pipe(R.prop('name'), R.set(lName)),
    R.pipe(R.prop('dir'), R.set(lDir)),
    R.pipe(R.prop('author'), R.set(lAuthor)),
    R.pipe(R.prop('version'), R.set(lVersion)),
    R.pipe(R.prop('description'), R.set(lDescription)),
    R.pipe(R.prop('keywords'), R.set(lKeywords)),
    R.pipe(R.prop('license'), R.set(lLicense))
]);

const cond = [
    [INIT_CONFIG_RESPONSE, (state, { payload }) => mapPayloadToSetter(payload)(state)]
];

export default combineActionReducers(cond, defaults);
