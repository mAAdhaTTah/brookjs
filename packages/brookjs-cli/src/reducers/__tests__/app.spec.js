/* eslint-env mocha */
import { expect } from 'chai';
import { initConfigResponse } from '../../actions';
import app from '../app';

describe('reducer#app', () => {
    it('will return same state on random action', () => {
        const state = {
            name: '',
            dir: 'src',
            version: '0.0.0',
            description: '',
            keywords: [],
            author: '',
            license: 'ISC'
        };

        expect(app(state, { type: 'RANDOM' })).to.deep.equal(state);
    });

    it('will update state from config response', () => {
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

        expect(app(state, action)).to.deep.equal({
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
});
