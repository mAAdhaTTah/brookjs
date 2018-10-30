/* eslint-env mocha */
import { expect } from 'chai';
import { createStore } from 'redux';
import { eddy, loop } from '../eddy';

describe('eddy', () => {
    const defaultState = {
        actions: []
    };

    const reducer = (state = defaultState, action) => {
        switch (action.type) {
            case 'HOLD':
                return {
                    actions: [...state.actions, action.type]
                };
            case 'NEXT':
                return loop({
                    actions: [...state.actions, action.type]
                }, {
                    type: 'HOLD'
                });
            case 'MANY':
                return loop({
                    actions: [...state.actions, action.type]
                }, [{ type: 'HOLD' }, { type: 'FINAL' }]);
            case 'FINAL':
                return loop({
                    actions: [...state.actions, action.type]
                }, loop.NONE);
            default:
                return state;
        }
    };

    let store;

    beforeEach(() => {
        store = createStore(reducer, eddy());
    });

    it('should return a redux store', () => {
        expect(store.subscribe).to.be.a('function');
        expect(store.getState).to.be.a('function');
        expect(store.getState()).to.equal(defaultState);
    });

    it('should handle normal actions by default', () => {
        store.dispatch({ type: 'HOLD' });

        expect(store.getState()).to.deep.equal({
            actions: ['HOLD']
        });
    });

    it('should dispatch actions returned by loop', () => {
        store.dispatch({ type: 'NEXT' });

        expect(store.getState()).to.deep.equal({
            actions: ['NEXT', 'HOLD']
        });
    });

    it('should dispatch array of actions', () => {
        store.dispatch({ type: 'MANY' });

        expect(store.getState()).to.deep.equal({
            actions: ['MANY', 'HOLD', 'FINAL']
        });
    });

    it('should not dispatch action with NONE', () => {
        store.dispatch({ type: 'FINAL' });

        expect(store.getState()).to.deep.equal({
            actions: ['FINAL']
        });
    });
});
