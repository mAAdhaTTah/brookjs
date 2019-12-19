import { Stream } from 'kefir';

export interface ActionCreator<A extends { type: string }> {
  (...a: any[]): A;
}

/**
 * Accepts a varying number of types, and returns a function that
 * takes an Observable of actions and filters them based on the
 * types provided. Reads `action.type` to match.
 *
 * Checks loosely against action.type, which should always be
 * a string, as this is intended to be used with with the actions
 * emitted from a Redux store. This is exposed so it works with
 * redux-actions' action creator functions, which come with
 * `toString` to allow loose comparison.
 *
 * Intended to be used with Kefir's `thru` method.
 */
export function ofType<
  A1 extends { type: string },
  E,
  V extends { type: string }
>(ac1: ActionCreator<A1>): (obs: Stream<V, E>) => Stream<A1, E>;
export function ofType<
  A1 extends { type: string },
  A2 extends { type: string },
  E,
  V extends { type: string }
>(
  ac1: ActionCreator<A1>,
  ac2: ActionCreator<A2>
): (obs: Stream<V, E>) => Stream<A1 | A2, E>;
export function ofType<
  A1 extends { type: string },
  A2 extends { type: string },
  A3 extends { type: string },
  E,
  V extends { type: string }
>(
  ac1: ActionCreator<A1>,
  ac2: ActionCreator<A2>,
  ac3: ActionCreator<A3>
): (obs: Stream<V, E>) => Stream<A1 | A2 | A3, E>;
export function ofType<
  A1 extends { type: string },
  A2 extends { type: string },
  A3 extends { type: string },
  A4 extends { type: string },
  E,
  V extends { type: string }
>(
  ac1: ActionCreator<A1>,
  ac2: ActionCreator<A2>,
  ac3: ActionCreator<A3>,
  ac4: ActionCreator<A4>
): (obs: Stream<V, E>) => Stream<A1 | A2 | A3 | A4, E>;
export function ofType<
  A1 extends { type: string },
  A2 extends { type: string },
  A3 extends { type: string },
  A4 extends { type: string },
  A5 extends { type: string },
  E,
  V extends { type: string }
>(
  ac1: ActionCreator<A1>,
  ac2: ActionCreator<A2>,
  ac3: ActionCreator<A3>,
  ac4: ActionCreator<A4>,
  ac5: ActionCreator<A5>
): (obs: Stream<V, E>) => Stream<A1 | A2 | A3 | A4 | A5, E>;
export function ofType<A extends { type: string }, E>(
  ...types: string[]
): (obs: Stream<A, E>) => Stream<A, E>;
export function ofType<A extends { type: string }, E>(
  ...types: any[]
): (obs: Stream<A, E>) => Stream<A, E> {
  return obs$ =>
    obs$
      .filter(action => {
        const type = action.type;
        const len = types.length;

        if (len === 1) {
          // eslint-disable-next-line eqeqeq
          return type == types[0];
        } else {
          for (let i = 0; i < len; i++) {
            // eslint-disable-next-line eqeqeq
            if (types[i] == type) {
              return true;
            }
          }
        }
        return false;
      })
      .setName(obs$, 'ofType');
}
