/* eslint-env jest */
import $$observable from 'symbol-observable';
import { Store, Observer } from 'redux';
import fromReduxStore from '../fromReduxStore';

const { value } = KTU;

const createMockStore = <T extends {}>(
  state?: T
): Store & { setState(state: T): void } => {
  const store = {
    state,
    callbacks: [] as Function[],

    setState(state: T) {
      store.state = state;

      store.runCallbacks();
    },

    getState(): T {
      return store.state as T;
    },

    subscribe(callback: Function) {
      store.callbacks.push(callback);
    },

    runCallbacks() {
      store.callbacks.forEach(callback => callback());
    },

    [$$observable]() {
      return {
        subscribe: (observer: Observer<T>) => {
          const observe = () => observer.next?.(store.getState());

          observe();

          const unsubscribe = store.subscribe(observe);

          return { unsubscribe };
        },

        [$$observable]() {
          return this;
        }
      };
    }
  };

  return store as any;
};

describe('fromReduxStore', () => {
  it('should be a function', () => {
    expect(fromReduxStore).toBeInstanceOf(Function);
  });

  it('should return a property', () => {
    const store = createMockStore();

    expect(fromReduxStore(store)).toBeProperty();
  });

  it('should emit the initial value', () => {
    const store = createMockStore(true);
    const state$ = fromReduxStore(store);

    expect(state$).toEmit([value(true, { current: true })]);
  });

  it('should emit new values', () => {
    const store = createMockStore(true);
    const state$ = fromReduxStore(store);

    expect(state$).toEmit(
      [value(true, { current: true }), value(false)],
      () => {
        store.setState(false);
      }
    );
  });
});
