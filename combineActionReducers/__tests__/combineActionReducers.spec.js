/* eslint-env mocha */
import R from 'ramda';

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import combineActionReducers from '../';

chai.use(sinonChai);

const TYPE = 'TYPE';

describe('combineActionReducers', () => {
    let reducer, spy;
    const initial = { value: 'initial value' };
    const returns = { value: 'returned value' };

    beforeEach(() => {
        spy = sinon.spy(R.always(returns));
        reducer = combineActionReducers([
            [TYPE, spy]
        ]);
    });

    it('should return a function', () => {
        expect(reducer).to.be.a('function');
    });

    it('should return initial when action.type does not match', () => {
        const result = reducer(initial, { type: 'NOT_TYPE' });

        expect(spy).to.have.callCount(0);
        expect(result).to.equal(initial);
    });

    it('should return new when action.type does match', () => {
        const result = reducer({}, { type: TYPE });

        expect(spy).to.have.callCount(1);
        expect(result).to.equal(returns);
    });
});
