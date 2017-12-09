/* eslint-env mocha */
import { expect } from 'chai';
import { readEnv } from '../../actions';
import env from '../env';

describe('reducer#env', () => {
    it('will return same state on random action', () => {
        const state = {};

        expect(env(state, { type: 'RANDOM' })).to.equal(state);
    });

    it('will update state from env read', () => {
        const state = {};
        const action = readEnv('/path/to/cwd');

        expect(env(state, action)).to.deep.equal({
            cwd: '/path/to/cwd'
        });
    });
});
