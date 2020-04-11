/* eslint-env jest */
import { applyMiddleware, createStore } from 'redux';
import Kefir, { Pool, Subscription } from 'kefir';
import configureStore from 'redux-mock-store';
import { ofType } from 'brookjs-flow';
import { Reducer } from 'react';
import { observeDelta } from '../observeDelta';

const { value } = KTU;

const setup = () => {
  let delta$: Pool<{ type: string }, never>;
  const delta = jest.fn(() => (delta$ = Kefir.pool<{ type: string }, never>()));
  const initial = { changed: false };
  const reducer: Reducer<any, any> = function reducer(
    state = initial,
    { type },
  ) {
    switch (type) {
      case 'AN_ACTION':
        return { changed: true };
      default:
        return state;
    }
  };
  const store = createStore(
    reducer,
    initial,
    applyMiddleware(observeDelta(delta)),
  );
  const [actions$, state$] = delta.mock.calls[0] as any;

  return { delta, delta$: delta$!, reducer, initial, store, actions$, state$ };
};

describe('observeDelta', function () {
  let sub: Subscription | undefined;

  it('should call the delta with actions$ and state$', function () {
    const { actions$, state$ } = setup();
    expect(actions$).toBeObservable();
    expect(state$).toBeObservable();
  });

  it('should dispatch action to actions$', function () {
    const action = { type: 'AN_ACTION' };
    const value = jest.fn();
    const { actions$, store } = setup();
    sub = actions$.observe({ value });

    store.dispatch(action);

    expect(value).toHaveBeenCalledTimes(1);
    expect(value).toHaveBeenCalledWith(action);
  });

  it('should dispatch state to state$', function () {
    const action = { type: 'AN_ACTION' };
    const value = jest.fn();
    const { state$, store } = setup();
    sub = state$.observe({ value });

    store.dispatch(action);

    expect(value).toHaveBeenCalledTimes(2);
    expect(value).toHaveBeenNthCalledWith(1, { changed: false });
    expect(value).toHaveBeenNthCalledWith(2, { changed: true });
  });

  it('should dispatch delta$ events to actions$', function () {
    const action = { type: 'AN_ACTION' };
    const value = jest.fn();
    const { actions$, delta$ } = setup();
    sub = actions$.observe({ value });

    delta$.plug(Kefir.constant(action));

    expect(value).toHaveBeenCalledTimes(1);
    expect(value).toHaveBeenCalledWith(action);
  });

  it('should dispatch delta$ events to store', function () {
    const action = { type: 'AN_ACTION' };
    const subscribe = jest.fn();
    const { delta$, store } = setup();
    store.subscribe(subscribe);

    delta$.plug(Kefir.constant(action));

    expect(subscribe).toHaveBeenCalledTimes(1);
  });

  it('should emit the actions in the correct order', () => {
    const delta1 = jest.fn(action$ =>
      action$.thru(ofType('REQUEST')).map(() => ({ type: 'FIRST_RESPONSE' })),
    );
    const delta2 = jest.fn(action$ =>
      action$
        .thru(ofType('FIRST_RESPONSE'))
        .map(() => ({ type: 'SECOND_RESPONSE' })),
    );
    const store = configureStore([observeDelta(delta1, delta2)])({});
    const [action$] = delta2.mock.calls[0];

    expect(action$).toEmit(
      [
        value({ type: 'REQUEST' }),
        value({ type: 'FIRST_RESPONSE' }),
        value({ type: 'SECOND_RESPONSE' }),
      ],
      () => {
        store.dispatch({ type: 'REQUEST' });
      },
    );
  });

  it('should interleave actions emitted in the middle of queue', () => {
    const delta1 = jest.fn(action$ =>
      action$
        .thru(ofType('FIRST_REQUEST'))
        .map(() => ({ type: 'SECOND_REQUEST' })),
    );
    const delta2 = jest.fn(action$ =>
      Kefir.merge<{ type: string }, never>([
        action$
          .thru(ofType('FIRST_REQUEST'))
          .map(() => ({ type: 'FIRST_RESPONSE' })),
        action$
          .thru(ofType('SECOND_REQUEST'))
          .map(() => ({ type: 'SECOND_RESPONSE' })),
      ]),
    );
    const store = configureStore([observeDelta(delta1, delta2)])({});
    const [action$] = delta2.mock.calls[0];

    expect(action$).toEmit(
      [
        value({ type: 'FIRST_REQUEST' }),
        value({ type: 'SECOND_REQUEST' }),
        value({ type: 'SECOND_RESPONSE' }),
        value({ type: 'FIRST_RESPONSE' }),
      ],
      () => {
        store.dispatch({ type: 'FIRST_REQUEST' });
      },
    );
  });

  afterEach(function () {
    if (sub) {
      sub.unsubscribe();
    }
  });
});
