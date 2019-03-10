import chaiKefir from 'chai-kefir';
import React from 'react';
import { RootJunction } from 'brookjs-silt';
import { render } from 'react-testing-library';
import { Clock } from 'lolex';
const deepEql = require('deep-eql');
const createHelpers = require('kefir-test-utils').default;

const noop = () => {};

export default ({ Kefir }: { Kefir: typeof import('kefir') }) => {
  const helpers = createHelpers(Kefir);
  const { withFakeTime, watchWithTime, send, stream, prop, value } = helpers;
  const { plugin } = chaiKefir(Kefir);

  return {
    ...helpers,
    plugin: (chai: any, utils: any) => {
      plugin(chai, utils);

      chai.Assertion.addMethod('emitFromDelta', function emitFromDelta(
        this: any,
        expected: any,
        cb: (a: any, b: any, c: any) => void = noop,
        { timeLimit = 10000 } = {}
      ) {
        let log;
        const delta = utils.getActual(this, arguments);
        const action$ = stream();
        const state$ = prop();
        const delta$ = delta(action$, state$);

        withFakeTime((tick: (x: number) => void, clock: Clock) => {
          log = watchWithTime(delta$);
          const sendAPI = (action: any, state: any) => {
            send(state$, [value(state)]);
            send(action$, [value(action)]);
          };
          cb(sendAPI, tick, clock);
          tick(timeLimit);
        });

        this.assert(
          deepEql(log, expected),
          `Expected to emit #{exp}, actually emitted #{act}`,
          `Expected to not emit #{exp}, actually emitted #{act}`,
          expected,
          log
        );
      });

      chai.Assertion.addMethod('emitFromJunction', function emitFromJunction(
        this: any,
        expected: any,
        cb: (a: any, b: any, c: any) => void = noop,
        { timeLimit = 10000 } = {}
      ) {
        let log;
        const root$ = (root$: any) => {
          log = watchWithTime(root$);
        };
        const element = utils.getActual(this, arguments);

        withFakeTime((tick: any, clock: any) => {
          const api = render(
            <RootJunction root$={root$}>{element}</RootJunction>
          );
          cb(api, tick, clock);
          tick(timeLimit);
          api.unmount();
        });

        this.assert(
          deepEql(log, expected),
          `Expected to emit #{exp}, actually emitted #{act}`,
          `Expected to not emit #{exp}, actually emitted #{act}`,
          expected,
          log
        );
      });
    }
  };
};
