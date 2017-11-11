import chaiKefir from 'chai-kefir';
import deepEql from 'deep-eql';
import lolex from 'lolex';

/**
 * A lot of this code is duplicated w/ chai-kefir. Can we share?
 */
const END = 'end';
const VALUE = 'value';
const ERROR = 'error';

export default ({ Kefir }) => {
    const { plugin, value, error, end, ...rest } = chaiKefir(Kefir);

    const logItem = (event, current) => {
        switch (event.type) {
            case VALUE:
                return value(event.value, { current });
            case ERROR:
                return error(event.value, { current });
            case END:
                return end({ current });
        }
    };

    const withFakeTime = cb => {
        const clock = lolex.install({ now: 1000 });
        cb(clock.runToFrame, clock);
        clock.uninstall();
    };

    const watchWithTime = obs => {
        const startTime = new Date();
        const log = [];
        let isCurrent = true;
        obs.onAny(event => log.push([new Date() - startTime, logItem(event, isCurrent)]));
        isCurrent = false;
        return log;
    };

    return {
        ...rest,
        value, error, end,
        plugin: (chai, utils) => {
            plugin(chai, utils);

            chai.Assertion.addMethod('emitEffectsInTime', function emitEffectsInTime(expected, cb) {
                let log;
                const actual = utils.getActual(this, arguments)[Symbol.for('@@brookjs/internals')].effect$$;

                withFakeTime((frame, clock) => {
                    log = watchWithTime(actual);
                    cb(frame, clock);
                    log = log.map(([time, item]) => [time, { ...item, value: item.value.$meta }]);
                });

                this.assert(
                    deepEql(log, expected),
                    `Expected to emit ${utils.objDisplay(expected)}, actually emitted ${utils.objDisplay(log)}`,
                    `Expected to not emit ${utils.objDisplay(expected)}, actually emitted ${utils.objDisplay(log)}`
                );
            });
        }
    };
};
