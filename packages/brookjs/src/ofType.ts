import { Stream } from 'kefir';

interface ActionCreator<A extends { type: string }> {
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
function ofType<
  A1 extends { type: string },
  AC1 extends ActionCreator<A1>,
  E,
  V extends { type: string }
>(ac1: AC1): (obs: Stream<V, E>) => Stream<A1, E>;
function ofType<
  A1 extends { type: string },
  AC1 extends ActionCreator<A1>,
  A2 extends { type: string },
  AC2 extends ActionCreator<A2>,
  E,
  V extends { type: string }
>(ac1: AC1, ac2: AC2): (obs: Stream<V, E>) => Stream<A1 | A2, E>;
function ofType<
  A1 extends { type: string },
  AC1 extends ActionCreator<A1>,
  A2 extends { type: string },
  AC2 extends ActionCreator<A2>,
  A3 extends { type: string },
  AC3 extends ActionCreator<A3>,
  E,
  V extends { type: string }
>(ac1: AC1, ac2: AC2, ac3: AC3): (obs: Stream<V, E>) => Stream<A1 | A2 | A3, E>;
function ofType<
  A1 extends { type: string },
  AC1 extends ActionCreator<A1>,
  A2 extends { type: string },
  AC2 extends ActionCreator<A2>,
  A3 extends { type: string },
  AC3 extends ActionCreator<A3>,
  A4 extends { type: string },
  AC4 extends ActionCreator<A4>,
  E,
  V extends { type: string }
>(
  ac1: AC1,
  ac2: AC2,
  ac3: AC3,
  ac4: AC4
): (obs: Stream<V, E>) => Stream<A1 | A2 | A3 | A4, E>;
function ofType<
  A1 extends { type: string },
  AC1 extends ActionCreator<A1>,
  A2 extends { type: string },
  AC2 extends ActionCreator<A2>,
  A3 extends { type: string },
  AC3 extends ActionCreator<A3>,
  A4 extends { type: string },
  AC4 extends ActionCreator<A4>,
  A5 extends { type: string },
  AC5 extends ActionCreator<A5>,
  E,
  V extends { type: string }
>(
  ac1: AC1,
  ac2: AC2,
  ac3: AC3,
  ac4: AC4,
  ac5: AC5
): (obs: Stream<V, E>) => Stream<A1 | A2 | A3 | A4 | A5, E>;
function ofType<A extends { type: string }, E>(
  ...types: string[]
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

export default ofType;
