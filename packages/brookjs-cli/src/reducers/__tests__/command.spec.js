import { test } from 'brookjs-desalinate';
import { run } from '../../actions';
import command from '../command';

test('will return same state on random action', t => {
    t.plan(1);

    const state = {};

    t.is(command(state, { type: 'RANDOM' }), state);
});

test('will update the values to match action', t => {
    t.plan(1);

    const state = {};

    t.deepEqual(command(state, run('command', {}, {})), {
        name: 'command',
        args: {},
        opts: {}
    });
});
