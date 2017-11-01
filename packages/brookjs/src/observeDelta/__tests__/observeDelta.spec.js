/* eslint-env mocha */

import Kefir from '../../kefir';
import { applyMiddleware, createStore } from 'redux';
import { observeDelta } from '../index';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

describe('observeDelta', function() {
    let delta, delta$, deltaMiddlware, reducer, initial, store, actions$, state$, sub;

    beforeEach(function() {
        delta = sinon.spy(function() {
            return delta$ = Kefir.pool();
        });
        deltaMiddlware = observeDelta(delta);
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
        store = createStore(reducer, initial, applyMiddleware(deltaMiddlware));
        [actions$, state$] = delta.args[0];
    });

    it('should call the delta with actions$ and state$', function() {
        expect(actions$).to.be.an.instanceof(Kefir.Observable);
        expect(state$).to.be.an.instanceof(Kefir.Observable);
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

    it('should dispatch delta$ events to actions$', function() {
        const action = { type: 'AN_ACTION' };
        const value = sinon.spy();
        sub = actions$.observe({ value });

        delta$.plug(Kefir.constant(action));

        expect(value).to.have.been.calledOnce;
        expect(value).to.have.been.calledWithExactly(action);
    });

    it('should dispatch delta$ events to store', function() {
        const action = { type: 'AN_ACTION' };
        const subscribe = sinon.spy();
        store.subscribe(subscribe);

        delta$.plug(Kefir.constant(action));

        expect(subscribe).to.be.calledOnce;
    });

    afterEach(function() {
        if (sub) {
            sub.unsubscribe();
        }
    });
});
