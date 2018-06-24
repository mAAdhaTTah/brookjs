/* eslint-env mocha */
import { expect, use } from 'chai';
import Kefir from 'kefir';
import { chaiPlugin } from 'brookjs-desalinate';
import { run, readEnv, readRcFile, readRcFileError } from '../../actions';
import envDelta from '../envDelta';

const { plugin, send, prop, stream, value, end } = chaiPlugin({ Kefir });
use(plugin);

const beaverrc = {
    dir: '/path/to/dir'
};
const cwd = '/path/to/cwd';
const state = { env: { cwd } };

const createMockServices = () => ({
    process: {
        cwd () {
            return cwd;
        }
    },
    require (path) {
        expect(path).to.equal(cwd + '/.beaverrc.js');

        return beaverrc;
    }
});

describe('delta#envDelta', () => {
    let actions$, state$;

    beforeEach(() => {
        // Create delta streams and prefill state.
        actions$ = stream();
        state$ = prop();

        send(state$, [value(state)]);
    });

    it('should do nothing on random action', () => {
        const delta$ = envDelta(
            createMockServices(),
            actions$,
            state$
        );

        expect(delta$).to.emit([], () =>
            send(actions$, [value({ type: 'RANDOM' })]));
    });

    it('reads cwd but not .beaverrc on new command', () => {
        const delta$ = envDelta(
            createMockServices(),
            actions$,
            state$
        );

        expect(delta$).to.emit([value(readEnv('/path/to/cwd')), end()], () =>
            send(actions$, [value(run('new', {}, {}))]));
    });

    it('reads cwd and .beaverrc on non-new command', () => {
        const delta$ = envDelta(
            createMockServices(),
            actions$,
            state$
        );

        expect(delta$).to.emit([value(readEnv(cwd)), value(readRcFile(beaverrc)), end()], () => {
            send(actions$, [value(run('test', {}, {}))]);
            send(actions$, [value(readEnv(cwd))]);
        });
    });

    it('reads cwd but error .beaverrc on new command', () => {
        const error = new TypeError();
        const services = createMockServices();
        // Overwrite require
        services.require = path => {
            expect(path).to.equal(cwd + '/.beaverrc.js');

            throw error;
        };
        const delta$ = envDelta(
            services,
            actions$,
            state$
        );

        expect(delta$).to.emit([value(readEnv(cwd)), value(readRcFileError(error)), end()], () => {
            send(actions$, [value(run('test', {}, {}))]);
            send(actions$, [value(readEnv(cwd))]);
        });
    });
});
