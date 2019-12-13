/* eslint-env jest */
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
      store = eddy()(createStore)(reducer);
    });

    it('should return a redux store', () => {
      expect(store.subscribe).toBeInstanceOf(Function);
      expect(store.getState).toBeInstanceOf(Function);
      expect(store.getState()).toBe(defaultState);
    });

    it('should upgrade new reducers', () => {
      const defaultState = {
        dispatches: []
      };
      const reducer = () => defaultState;
      store.replaceReducer(reducer);
      expect(store.getState()).toBe(defaultState);
    });

    it('should handle normal actions by default', () => {
      store.dispatch({ type: 'HOLD' });

      expect(store.getState()).toEqual({
        actions: ['HOLD']
      });
    });

    it('should dispatch actions returned by loop', () => {
      store.dispatch({ type: 'NEXT' });

      expect(store.getState()).toEqual({
        actions: ['NEXT', 'HOLD']
      });
    });

    it('should dispatch array of actions', () => {
      store.dispatch({ type: 'MANY' });

      expect(store.getState()).toEqual({
        actions: ['MANY', 'HOLD', 'FINAL']
      });
    });

    it('should not dispatch action with NONE', () => {
      store.dispatch({ type: 'FINAL' });

      expect(store.getState()).toEqual({
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

    const reducer = combineReducers(reducerMap);
    let store: Store;

    beforeEach(() => {
      store = createStore(reducer as any, eddy());
    });

    it('should return a reducer function', () => {
      expect(reducer).toBeInstanceOf(Function);
    });

    it('should dispatch actions returned from subreducers', () => {
      store.dispatch({ type: 'PING' });
      expect(store.getState()).toEqual({
        pings: 2,
        pongs: 2
      });
    });

    it('should return same state if unchanged', () => {
      const prevState = store.getState();
      store.dispatch({ type: 'OTHER' });
      expect(store.getState()).toBe(prevState);
    });
  });
});
