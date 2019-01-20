import React from 'react';
import jestKefir from 'jest-kefir';
import createHelpers from 'kefir-test-utils';
import { render } from 'react-testing-library';
import { RootJunction } from 'brookjs-silt';

const noop = () => {};

export default ({ Kefir }) => {
    const helpers = createHelpers(Kefir);
    const { withFakeTime, watchWithTime, send, stream, prop, value } = helpers;
    const { extensions } = jestKefir(Kefir);

    return {
        ...helpers,
        extensions: {
            ...extensions,

            toEmitFromDelta(delta, expected, cb = noop, { timeLimit = 10000 } = {}) {
                let log;
                const action$ = stream();
                const state$ = prop();
                const delta$ = delta(action$, state$);

                withFakeTime((tick, clock) => {
                    log = watchWithTime(delta$);
                    const sendAPI = (action, state) => {
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

            toEmitFromJunction(element, expected, cb = noop, { timeLimit = 10000 } = {}) {
                let log;
                const root$ = root$ => {
                    log = watchWithTime(root$);
                };

                withFakeTime((tick, clock) => {
                    const api = render(
                        <RootJunction root$={root$}>
                            {element}
                        </RootJunction>
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
