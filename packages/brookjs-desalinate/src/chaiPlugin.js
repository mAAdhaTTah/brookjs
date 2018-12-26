import chaiKefir from 'chai-kefir';
import createHelpers from 'kefir-test-utils';
import deepEql from 'deep-eql';

export default ({ Kefir }) => {
    const helpers = createHelpers(Kefir);
    const { withFakeTime, watchWithTime, send, stream, prop, value } = helpers;
    const { plugin } = chaiKefir(Kefir);

    return {
        ...helpers,
        plugin: (chai, utils) => {
            plugin(chai, utils);

            chai.Assertion.addMethod('emitFromDelta', function emitFromDelta(
                expected,
                cb,
                { timeLimit = 10000 } = {}
            ) {
                let log;
                const delta = utils.getActual(this, arguments);
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
