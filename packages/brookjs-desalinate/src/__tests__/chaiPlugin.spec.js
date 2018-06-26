/* eslint-env mocha */
import Kefir from 'kefir';
import { expect } from 'chai';
import chaiPlugin from '../chaiPlugin';

describe('chaiPlugin', () => {
    it('should be a function', () => {
        expect(chaiPlugin).to.be.a('function');
    });

    it('should return an object', () => {
        expect(chaiPlugin({ Kefir })).to.be.a('object');
    });
});
