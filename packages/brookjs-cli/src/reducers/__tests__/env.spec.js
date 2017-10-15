import { test } from 'brookjs-desalinate';
import { readEnv } from '../../actions';
import env from '../env';

test('will return same state on random action', t => {
    t.plan(1);

    const state = {};

    t.is(env(state, { type: 'RANDOM' }), state);
});

test('will update state from env read', t => {
    t.plan(1);

    const state = {};
    const action = readEnv('/path/to/cwd');

    t.deepEqual(env(state, action), {
        cwd: '/path/to/cwd'
    });
});
