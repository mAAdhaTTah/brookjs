/* eslint-env mocha */

import { constant, Observable, pool } from 'kefir';
import { createStore } from 'redux';
import createEnhancer from '../index';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

describe('enhancer', function() {
    let system, system$, enhancer, reducer, initial, store, actions$, state$, sub;

    beforeEach(function() {
        system = sinon.spy(function() {
            return system$ = pool();
        });
        enhancer = createEnhancer(system);
        initial = { changed: false };
        reducer = function reducer(state = {}, { type }) {
            switch (type) {
                case 'AN_ACTION':
                    return { changed: true };
                    break;
                default:
                    return state;
            }
        };
        store = createStore(reducer, initial, enhancer);
        [actions$, state$] = system.args[0];
    });

    it('should call the system with actions$ and state$', function() {
        expect(actions$).to.be.an.instanceof(Observable);
        expect(state$).to.be.an.instanceof(Observable);
    });

    it('should dispatch action to actions$', function() {
        const action = { type: 'AN_ACTION' };
        const value = sinon.spy();
        sub = actions$.observe({ value });

        store.dispatch(action);

        expect(value).to.have.been.calledOnce;
        expect(value).to.have.been.calledWithExactly(action);
    });

    it('should dispatch state to state$', function() {
        const action = { type: 'AN_ACTION' };
        const value = sinon.spy();
        sub = state$.observe({ value });

        store.dispatch(action);

        expect(value).to.have.been.calledTwice;
        expect(value).to.have.been.calledWith({ changed: false });
        expect(value).to.have.been.calledWith({ changed: true });
    });

    it('should dispatch system$ events to actions$', function() {
        const action = { type: 'AN_ACTION' };
        const value = sinon.spy();
        sub = actions$.observe({ value });

        system$.plug(constant(action));

        expect(value).to.have.been.calledOnce;
        expect(value).to.have.been.calledWithExactly(action);
    });

    it('should dispatch system$ events to store', function() {
        const action = { type: 'AN_ACTION' };
        const subscribe = sinon.spy();
        store.subscribe(subscribe);

        system$.plug(constant(action));

        expect(store.closed).to.be.not.ok;
        expect(subscribe).to.be.calledOnce;
    });

    it('should unsubscribe from systems$', function() {
        const action = { type: 'AN_ACTION' };
        const subscribe = sinon.spy();
        store.unsubscribe();
        store.subscribe(subscribe);

        system$.plug(constant(action));

        expect(store.closed).to.be.ok;
        expect(subscribe.called).to.not.be.ok;
    });

    afterEach(function() {
        if (sub) {
            sub.unsubscribe();
        }
    });
});
