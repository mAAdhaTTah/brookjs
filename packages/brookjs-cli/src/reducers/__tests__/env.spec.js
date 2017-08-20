import test from 'ava';
import { readEnv } from '../../actions';
import env from '../env';

test('will return same state on random action', t => {
    const state = {};

    t.is(env(state, { type: 'RANDOM' }), state);
});

test('will update state from env read', t => {
    const state = {};
    const action = readEnv('/path/to/cwd');

    t.deepEqual(env(state, action), {
        cwd: '/path/to/cwd'
    });
});
