import test from 'ava';
import { initConfigResponse } from '../../actions';
import app from '../app';

test('will return same state on random action', t => {
    const state = {
        name: '',
        dir: 'src',
        version: '0.0.0',
        description: '',
        keywords: [],
        author: '',
        license: 'ISC'
    };

    t.is(app(state, { type: 'RANDOM' }), state);
});

test('will update state from config response', t => {
    const state = {
        name: '',
        dir: 'src',
        author: '',
        version: '0.0.0',
        description: '',
        keywords: [],
        license: 'ISC'
    };
    const action = initConfigResponse({
        name: 'brookjs-applcation',
        dir: 'client',
        author: 'Author Name',
        version: '1.0.0',
        description: 'A brookjs application.',
        keywords: [
            'brookjs'
        ],
        license: 'MIT'
    });

    t.deepEqual(app(state, action), {
        name: 'brookjs-applcation',
        dir: 'client',
        author: 'Author Name',
        version: '1.0.0',
        description: 'A brookjs application.',
        keywords: [
            'brookjs'
        ],
        license: 'MIT'
    });
});
