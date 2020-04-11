/* eslint-env jest */
import Kefir from 'kefir';
import { ofType } from 'brookjs-flow';
import { loop } from 'brookjs-eddy';
import { renderHook, act } from '@testing-library/react-hooks';
import { useDelta } from '../useDelta';

const { stream, send, value } = KTU;

type State = { counter: number };

type Action = { type: string };

describe('useDelta', () => {
  const initialState: State = {
    counter: 0,
  };
  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case 'INCREMENT':
        return {
          ...state,
          counter: state.counter + 1,
        };
      default:
        return state;
    }
  };

  it('should return state, dispatch, and root$', () => {
    const { result } = renderHook(() => useDelta(reducer, initialState));

    expect(result.current).toEqual({
      state: initialState,
      dispatch: expect.any(Function),
      root$: expect.any(Function),
    });
  });

  it('should dispatch actions and update the state', () => {
    const { result } = renderHook(() => useDelta(reducer, initialState));

    act(() => {
      result.current.dispatch({ type: 'INCREMENT' });
    });

    expect(result.current.state).toEqual({
      counter: 1,
    });
  });

  it('should dispatch actions from the root$ and unsubscribe as needed', () => {
    const { result } = renderHook(() => useDelta(reducer, initialState));
    const root$ = stream<any, any>();
    const sub = result.current.root$(root$);

    act(() => {
      send(root$, [value({ type: 'INCREMENT' })]);
    });

    expect(result.current.state).toEqual({
      counter: 1,
    });

    sub.unsubscribe();

    act(() => {
      send(root$, [value({ type: 'INCREMENT' })]);
    });

    // State is unchanged.
    expect(result.current.state).toEqual({
      counter: 1,
    });
  });

  it('should dispatch action & state to the provided delta', () => {
    const delta = jest.fn(() => Kefir.never());
    const { result } = renderHook(() => useDelta(reducer, initialState, delta));

    const [action$, state$] = delta.mock.calls[0] as any;

    // Initial state
    expect(state$).toEmit([value(initialState, { current: true })]);

    // State & action paired & timed correctly
    expect(Kefir.zip([action$, state$.sampledBy(action$)])).toEmit(
      [
        value([{ type: 'INCREMENT' }, { counter: 1 }]),
        value([{ type: 'INCREMENT' }, { counter: 2 }]),
      ],
      () => {
        act(() => {
          result.current.dispatch({ type: 'INCREMENT' });
        });

        act(() => {
          result.current.dispatch({ type: 'INCREMENT' });
        });
      },
    );
  });

  it('should dispatch actions from the provided delta', () => {
    let delta$: any;
    const delta: any = jest.fn(function () {
      return (delta$ = Kefir.pool());
    });
    const { result } = renderHook(() => useDelta(reducer, initialState, delta));

    act(() => {
      send(delta$, [value({ type: 'INCREMENT' })]);
    });

    expect(result.current.state).toEqual({
      counter: 1,
    });
  });

  it('should dispatch sync action from delta', () => {
    const delta = jest.fn(() => Kefir.constant({ type: 'INCREMENT' }));
    const { result } = renderHook(() => useDelta(reducer, initialState, delta));

    expect(result.current.state).toEqual({
      counter: 1,
    });
  });

  it('should dispatch action into delta if state does not change', () => {
    const delta = jest.fn(() => Kefir.never());
    const { result } = renderHook(() => useDelta(reducer, initialState, delta));

    const [action$, state$]: any = delta.mock.calls[0];

    expect(Kefir.zip([action$, state$.sampledBy(action$)])).toEmit(
      [
        value([{ type: 'RANDOM' }, { counter: 0 }]),
        value([{ type: 'INCREMENT' }, { counter: 1 }]),
        value([{ type: 'SOMETHING_ELSE' }, { counter: 1 }]),
      ],
      () => {
        act(() => {
          result.current.dispatch({ type: 'RANDOM' });
        });

        act(() => {
          result.current.dispatch({ type: 'INCREMENT' });
        });

        act(() => {
          result.current.dispatch({ type: 'SOMETHING_ELSE' });
        });
      },
    );
  });

  it('should dispatch actions from eddy reducer', () => {
    const initialState = {
      actions: [],
    };
    const eddyReducer = (state: any, action: any) => {
      switch (action.type) {
        case 'INCREMENT':
          return loop(
            { ...state, actions: [...state.actions, action.type] },
            { type: 'DOUBLE' },
          );
        default:
          return { ...state, actions: [...state.actions, action.type] };
      }
    };
    const { result } = renderHook(() => useDelta(eddyReducer, initialState));

    act(() => {
      result.current.dispatch({ type: 'INCREMENT' });
    });

    act(() => {
      result.current.dispatch({ type: 'INCREMENT' });
    });

    expect(result.current.state).toEqual({
      actions: ['INCREMENT', 'DOUBLE', 'INCREMENT', 'DOUBLE'],
    });
  });

  it('should dispatch actions from eddy & delta in correct order', () => {
    const initialState = {
      actions: [],
    };
    const eddyReducer = (state: any, action: any) => {
      switch (action.type) {
        case 'INCREMENT':
          return loop(
            { ...state, actions: [...state.actions, action.type] },
            { type: 'DOUBLE' },
          );
        case 'DOUBLE':
          return loop(
            { ...state, actions: [...state.actions, action.type] },
            { type: 'SQR_ROOT' },
          );
        default:
          return { ...state, actions: [...state.actions, action.type] };
      }
    };
    const delta = (action$: any) =>
      action$.thru(ofType('SQR_ROOT')).map(() => ({ type: 'THIRD' }));
    const { result } = renderHook(() =>
      useDelta(eddyReducer, initialState, delta),
    );

    act(() => {
      result.current.dispatch({ type: 'INCREMENT' });
    });

    act(() => {
      result.current.dispatch({ type: 'INCREMENT' });
    });

    expect(result.current.state).toEqual({
      actions: [
        'INCREMENT',
        'DOUBLE',
        'SQR_ROOT',
        'THIRD',
        'INCREMENT',
        'DOUBLE',
        'SQR_ROOT',
        'THIRD',
      ],
    });
  });
});
