import test from 'ava';
import { Kefir } from 'brookjs';
import { run, readEnv, readRcFile, readRcFileError } from '../../actions';
import envDelta from '../envDelta';

Kefir.Observable.prototype.ofType = Kefir.ActionObservable.prototype.ofType;

const beaverrc = {
    dir: '/path/to/dir'
};
const cwd = '/path/to/cwd';
const state = { env: { cwd } };

const createMockServices = t => ({
    process: {
        cwd () {
            t.pass();

            return cwd;
        }
    },
    require(path) {
        t.is(path, cwd + '/.beaverrc.js');

        return beaverrc;
    }
});

test('does nothing on random action', t => {
    t.plan(0);

    return envDelta(
        createMockServices(t),
        Kefir.constant({ type: 'RANDOM' }),
        Kefir.constant(state)
    )
        .map(() => t.fail('should not emit any actions'));
});

test('reads cwd but not .beaverrc on new command', t => {
    t.plan(2);

    return envDelta(
        createMockServices(t),
        Kefir.constant(run('new', {}, {})),
        Kefir.constant(state)
    )
        .map(action => t.deepEqual(action, readEnv('/path/to/cwd')));
});

test('reads cwd and .beaverrc on non-new command', t => {
    t.plan(5);

    let planned = [readEnv(cwd), readRcFile(beaverrc)];

    return envDelta(
        createMockServices(t),
        Kefir.constant(run('test', {}, {})),
        Kefir.constant(state)
    )
        .map(action => {
            for (let i = 0; planned.length > i; i++) {
                const plan = planned[i];

                if (plan.type === action.type) {
                    planned = planned.filter(src => src !== plan);

                    return t.deepEqual(plan, action);
                }
            }

            return t.fail('unplanned action: ' + action.type);
        })
        .beforeEnd(() => t.is(0, planned.length));
});

test('reads cwd but error .beaverrc on new command', t => {
    t.plan(5);

    const error = new TypeError();
    const services = createMockServices(t);
    // Overwrite require
    services.require = path => {
        t.is(path, cwd + '/.beaverrc.js');

        throw error;
    };

    let planned = [readEnv(cwd), readRcFileError(error)];

    return envDelta(
        services,
        Kefir.constant(run('test', {}, {})),
        Kefir.constant(state)
    )
        .map(action => {
            for (let i = 0; planned.length > i; i++) {
                const plan = planned[i];

                if (plan.type === action.type) {
                    planned = planned.filter(src => src !== plan);

                    return t.deepEqual(plan, action);
                }
            }

            return t.fail('unplanned action: ' + action.type);
        })
        .beforeEnd(() => t.is(0, planned.length));
});
