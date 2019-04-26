import React from 'react';
import jestKefir from 'jest-kefir';
import { render } from 'react-testing-library';
import { RootJunction } from 'brookjs-silt';
import createHelpers from 'kefir-test-utils';

const noop = () => {};

type Result = {
  pass: boolean;
  message: () => string;
};

export const jestPlugin = ({ Kefir }: { Kefir: typeof import('kefir') }) => {
  const helpers = createHelpers(Kefir);
  const { withFakeTime, watchWithTime, send, stream, prop, value } = helpers;
  const { extensions } = jestKefir(Kefir);

  return {
    ...helpers,
    extensions: {
      ...extensions,

      toEmitFromDelta(
        this: any,
        delta: any,
        expected: any,
        cb: (a: any, b: any, c: any) => void = noop,
        { timeLimit = 10000 } = {}
      ): Result {
        let log;
        const action$ = stream();
        const state$ = prop();
        const delta$ = delta(action$, state$);

        withFakeTime((tick: any, clock: any) => {
          log = watchWithTime(delta$);
          const sendAPI = (action: any, state: any) => {
            send(state$, [value(state)]);
            send(action$, [value(action)]);
          };
          cb(sendAPI, tick, clock);
          tick(timeLimit);
        });

        return {
          pass: this.equals(log, expected),
          message: () => `Expected to emit correct values from delta`
        };
      },

      toEmitFromJunction(
        this: any,
        element: any,
        expected: any,
        cb: (a: any, b: any, c: any) => void = noop,
        { timeLimit = 10000 } = {}
      ): Result {
        let log;
        const root$ = (root$: any) => {
          log = watchWithTime(root$);
        };

        withFakeTime((tick: any, clock: any) => {
          const api = render(
            <RootJunction root$={root$}>{element}</RootJunction>
          );
          cb(api, tick, clock);
          tick(timeLimit);
          api.unmount();
        });

        return {
          pass: this.equals(log, expected),
          message: () => `expected to emit values from junction`
        };
      }
    }
  };
};
