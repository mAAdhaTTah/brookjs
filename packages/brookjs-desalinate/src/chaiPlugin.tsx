import K, { Event } from 'kefir';
import chaiKefir from 'chai-kefir';
import React from 'react';
import { RootJunction } from 'brookjs-silt';
import { render } from 'react-testing-library';
import { Clock } from 'lolex';
import createHelpers from 'kefir-test-utils';
import deepEql from 'deep-eql';

declare global {
  namespace Chai {
    interface InstanceOfObservable {
      (): Assertion;
    }

    interface Assertion {
      emit: Emit<Assertion>;
      emitFromDelta: EmitFromDelta<Assertion>;
      emitFromJunction: EmitFromJunction<Assertion>;
    }

    interface TypeComparison {
      observable: InstanceOfObservable;
    }
  }
}

const noop = () => {};

export type ToDelta = (action: object, state: object) => void;
export type Tick = (time: number) => void;

export type Emit<A> = <V, E>(expected: Array<Event<V, E>>, cb: () => void) => A;
export type EmitFromDelta<A> = <V, E>(
  expected: Array<[number, Event<V, E>]>,
  cb?: (sendToDelta: ToDelta, tick: Tick, clock: Clock) => void,
  options?: { timeLimit?: number }
) => A;
export type EmitFromJunction<A> = <V, E>(
  expected: Array<[number, Event<V, E>]>,
  cb?: (api: ReturnType<typeof render>, tick: Tick, clock: Clock) => void,
  options?: { timeLimit?: number }
) => A;

export const chaiPlugin = ({ Kefir }: { Kefir: typeof K }) => {
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
