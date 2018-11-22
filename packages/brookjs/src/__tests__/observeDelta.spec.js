/* eslint-env mocha */
import { applyMiddleware, createStore } from 'redux';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Kefir from 'kefir';
import configureStore from 'redux-mock-store';
import { chaiPlugin } from 'brookjs-desalinate';
import ofType from '../ofType';
import observeDelta from '../observeDelta';

chai.use(sinonChai);
const { plugin, value } = chaiPlugin({ Kefir });
chai.use(plugin);

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

    it('should emit the actions in the correct order', () => {
        const delta1 = sinon.spy(action$ =>
            action$.thru(ofType('REQUEST'))
                .map(() => ({ type: 'FIRST_RESPONSE' }))
        );
        const delta2 = sinon.spy(action$ =>
            action$.thru(ofType('FIRST_RESPONSE'))
                .map(() => ({ type: 'SECOND_RESPONSE' }))
        );
        const store = configureStore([observeDelta(delta1, delta2)])({});
        const [action$] = delta2.args[0];

        expect(action$).to.emit([
            value({ type: 'REQUEST' }),
            value({ type: 'FIRST_RESPONSE' }),
            value({ type: 'SECOND_RESPONSE' }),
        ], () => {
            store.dispatch({ type: 'REQUEST' });
        });
    });

    afterEach(function() {
        if (sub) {
            sub.unsubscribe();
        }
    });
});
