/* eslint-env mocha */
import { expect } from 'chai';
import { createStore, Store, Action } from 'redux';
import { eddy, loop, combineReducers, EddyReducer } from '../eddy';

describe('eddy', () => {
  describe('enhance store', () => {
    const defaultState = {
      actions: [] as Action[]
    };

    type State = typeof defaultState;

    const reducer: EddyReducer<State, Action> = (
      state = defaultState,
      action
    ) => {
      switch (action.type) {
        case 'HOLD':
          return {
            actions: [...state.actions, action.type]
          };
        case 'NEXT':
          return loop(
            {
              actions: [...state.actions, action.type]
            },
            {
              type: 'HOLD'
            }
          );
        case 'MANY':
          return loop(
            {
              actions: [...state.actions, action.type]
            },
            [{ type: 'HOLD' }, { type: 'FINAL' }, loop.NONE]
          );
        case 'FINAL':
          return loop(
            {
              actions: [...state.actions, action.type]
            },
            loop.NONE
          );
        default:
          return state;
      }
    };

    let store: Store;

    beforeEach(() => {
      store = createStore(reducer as any, eddy());
    });

    it('should return a redux store', () => {
      expect(store.subscribe).to.be.a('function');
      expect(store.getState).to.be.a('function');
      expect(store.getState()).to.equal(defaultState);
    });

    it('should upgrade new reducers', () => {
      const defaultState = {
        dispatches: []
      };
      const reducer = () => defaultState;
      store.replaceReducer(reducer);
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

  describe('combineReducers', () => {
    const reducerMap = {
      pings: (state = 0, action: Action) =>
        action.type === 'PING' && state < 2
          ? loop(state + 1, { type: 'PONG' })
          : state,
      pongs: (state = 0, action: Action) =>
        action.type === 'PONG' && state < 2
          ? loop(state + 1, { type: 'PING' })
          : state
    };

    type State = { pings: number; pongs: number };

    const reducer = combineReducers<State, Action>(reducerMap);
    let store: Store;

    beforeEach(() => {
      store = createStore(reducer as any, eddy());
    });

    it('should return a reducer function', () => {
      expect(reducer).to.be.a('function');
    });

    it('should dispatch actions returned from subreducers', () => {
      store.dispatch({ type: 'PING' });
      expect(store.getState()).to.deep.equal({
        pings: 2,
        pongs: 2
      });
    });

    it('should return same state if unchanged', () => {
      const prevState = store.getState();
      store.dispatch({ type: 'OTHER' });
      expect(store.getState()).to.equal(prevState);
    });
  });
});
