/*eslint-env mocha */
import 'es6-weak-map/implement';
import { AssertionError } from 'assert';

import $$observable from 'symbol-observable';
import { constant, pool } from 'kefir';
import { F, identity, T } from 'ramda';

import chai, { expect } from 'chai';
import spies from 'chai-spies';
import component from '../index';

chai.use(spies);

describe('component', function() {
    it('should be a function', function() {
        expect(component).to.be.a('function');
    });

    it('should return a factory function', function() {
        const factory = component({});

        expect(factory).to.be.a('function');
    });

    describe('factory', function() {
        let factory, fixture, state$, instance, source, sub;

        function setup (config = {}) {
            factory = component(config);
            fixture = document.createElement('div');

            source = pool();
            source.plug(constant({}));
            state$ = source.toESObservable();

            instance = factory(fixture, state$);
        }

        beforeEach(function() {
            setup();
        });

        it('should require an HTMLElement', function() {
            const invalid = [{}, 'string', 2, true, []];

            invalid.forEach(el => {
                expect(function() {
                    factory(el, {});
                }).to.throw(AssertionError);
            });
        });

        it('should require an observable', function() {
            const invalid = [{}, 'string', 2, true, []];

            invalid.forEach(state => {
                expect(function() {
                    factory(fixture, state);
                }).to.throw(AssertionError);
            });
        });

        it('should return an observable', function() {
            expect(instance[$$observable]).to.be.a('function');
        });

        it('should call shouldUpdate immediately with two equal params', function() {
            const shouldUpdate = chai.spy(F);
            setup({ shouldUpdate });

            sub = instance.observe({ next: identity });

            expect(shouldUpdate).to.have.been.called.once().with.exactly({}, {});
        });

        afterEach(function() {
            if (sub) {
                sub.unsubscribe();
            }
        });
    });
});
