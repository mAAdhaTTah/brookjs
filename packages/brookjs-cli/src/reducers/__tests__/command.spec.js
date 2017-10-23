/* eslint-env mocha */
import { expect } from 'chai';
import { run } from '../../actions';
import command from '../command';

describe('reducer#command', () => {
    it('will return same state on random action', () => {
        const state = {};

        expect(command(state, { type: 'RANDOM' })).to.equal(state);
    });

    it('will update the values to match action', () => {
        const state = {};

        expect(command(state, run('command', {}, {}))).to.deep.equal({
            name: 'command',
            args: {},
            opts: {}
        });
    });
});
