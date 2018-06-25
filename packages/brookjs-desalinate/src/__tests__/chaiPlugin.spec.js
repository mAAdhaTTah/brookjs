/* eslint-env mocha */
import { expect } from 'chai';
import chaiPlugin from '../chaiPlugin';

describe('chaiPlugin', () => {
    it('should be a function', () => {
        expect(chaiPlugin).to.be.a('function');
    });
});
