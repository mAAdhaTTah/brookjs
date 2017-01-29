/* eslint-env mocha */
import R from 'ramda';

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import combineActionReducers from '../';

chai.use(sinonChai);

const TYPE = 'TYPE';

describe('combineActionReducers', () => {
    it('should return a function', () => {
        const { reducer } = createFixture();

        expect(reducer).to.be.a('function');
    });

    it('should return default when initial is undefined', () => {
        const { defaults, spy, reducer } = createFixture();
        const result = reducer(undefined, { type: 'NOT_TYPE' });

        expect(spy).to.have.callCount(0);
        expect(result).to.equal(defaults);
    });

    it('should return initial when action.type does not match', () => {
        const { reducer, initial, spy } = createFixture();
        const result = reducer(initial, { type: 'NOT_TYPE' });

        expect(spy).to.have.callCount(0);
        expect(result).to.equal(initial);
    });

    it('should return new when action.type does match', () => {
        const { reducer, returns, spy } = createFixture();
        const result = reducer({}, { type: TYPE });

        expect(spy).to.have.callCount(1);
        expect(result).to.equal(returns);
    });
});

/**
 * Creates some reusable test fixtures.
 *
 * @returns {Fixture} Test fixture.
 */
function createFixture() {
    const defaults = { value: 'default value' };
    const initial = { value: 'initial value' };
    const returns = { value: 'returned value' };
    const spy = sinon.spy(R.always(returns));
    const cond = [[TYPE, spy]];
    const reducer = combineActionReducers(cond, defaults);

    return { defaults, initial, returns, spy, cond, reducer };
}
