/* eslint-env mocha */
import { Kefir } from 'brookjs';
import { expect, use } from 'chai';
import chaiKefir, { prop, stream, send } from 'chai-kefir';
import { run, readEnv, readRcFile, readRcFileError } from '../../actions';
import envDelta from '../envDelta';

Kefir.Observable.prototype.ofType = Kefir.ActionObservable.prototype.ofType;

use(chaiKefir);

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

        send(state$, [state]);
    });

    it('should do nothing on random action', () => {
        const delta$ = envDelta(
            createMockServices(),
            actions$,
            state$
        );

        expect(delta$).to.emit([], () =>
            send(actions$, [{ type: 'RANDOM' }]));
    });

    it('reads cwd but not .beaverrc on new command', () => {
        const delta$ = envDelta(
            createMockServices(),
            actions$,
            state$
        );

        expect(delta$).to.emit([readEnv('/path/to/cwd'), '<end>'], () =>
            send(actions$, [run('new', {}, {})]));
    });

    it('reads cwd and .beaverrc on non-new command', () => {
        const delta$ = envDelta(
            createMockServices(),
            actions$,
            state$
        );

        expect(delta$).to.emit([readEnv(cwd), readRcFile(beaverrc), '<end>'], () => {
            send(actions$, [run('test', {}, {})]);
            send(actions$, [readEnv(cwd)]);
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

        expect(delta$).to.emit([readEnv(cwd), readRcFileError(error), '<end>'], () => {
            send(actions$, [run('test', {}, {})]);
            send(actions$, [readEnv(cwd)]);
        });
    });
});
