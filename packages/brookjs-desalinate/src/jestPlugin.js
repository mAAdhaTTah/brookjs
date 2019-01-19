import jestKefir from 'jest-kefir';
import createHelpers from 'kefir-test-utils';

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
            }
        }
    };
};
