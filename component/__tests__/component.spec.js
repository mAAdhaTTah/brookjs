/*eslint-env mocha */
import { AssertionError } from 'assert';

import $$observable from 'symbol-observable';
import { constant, pool, never } from 'kefir';
import { F, identity } from 'ramda';

import chai, { expect } from 'chai';
import spies from 'chai-spies';
import dom from 'chai-dom';

import component from '../index';

chai.use(spies);
chai.use(dom);

describe('component', function() {
    let api, factory, fixture, state$, instance, initial, sub;

    function setup (config = {}) {
        initial = {
            type: 'text',
            text: 'Hello world!'
        };

        factory = component(config);

        fixture = document.createElement('div');
        fixture.classList.add(initial.type);
        fixture.textContent = initial.text;

        state$ = pool();
        state$.plug(constant(initial));

        instance = factory(fixture, state$);
        api = { el: fixture };
    }

    describe('module', function() {
        beforeEach(function() {
            setup();
        });

        it('should be a function', function() {
            expect(component).to.be.a('function');
        });

        it('should return a factory function', function() {
            const factory = component({});

            expect(factory).to.be.a('function');
        });
    });

    describe('factory', function() {
        beforeEach(function() {
            setup();
        });

        it('should require an HTMLElement', function() {
            const invalid = [{}, 'string', 2, true, [], identity];

            invalid.forEach(el => {
                expect(() => factory(el, {})).to.throw(AssertionError);
            });
        });

        it('should require an observable', function() {
            const invalid = [{}, 'string', 2, true, []];

            invalid.forEach(state => {
                expect(() => factory(fixture, state)).to.throw(AssertionError);
            });
        });

        it('should return an observable', function() {
            expect(instance[$$observable]).to.be.a('function');
        });
    });

    describe('config', function() {
        describe('onMount', function () {
            let onMount, return$;

            beforeEach(function() {
                return$ = pool();
                onMount = chai.spy(() => return$);

                setup({ onMount });
            });

            it('should throw without function', function() {
                const invalid = [{}, 'string', 2, true, []];

                invalid.forEach(onMnt => {
                    expect(() => component({ onMount: onMnt })).to.throw(AssertionError);
                });
            });

            it('should call onMount once with initial state and api', function() {
                sub = instance.observe({ next: identity });

                expect(onMount).to.have.been.called.once().with.exactly(api, initial);
            });

            it('should propagate stream events', function() {
                const next = chai.spy();
                const state = {
                    type: 'EVENT_NAME',
                    payload: {
                        value: 'some value'
                    }
                };

                sub = instance.observe({ next });
                return$.plug(constant(state));

                expect(next).to.have.been.called.once().with.exactly(state);
            });
        });

        describe('shouldUpdate', function() {
            let shouldUpdate;

            beforeEach(function() {
                shouldUpdate = chai.spy(F);
                setup({ shouldUpdate });
            });

            it('should throw without function', function() {
                const invalid = [{}, 'string', 2, true, []];

                invalid.forEach(shUp => {
                    expect(() => component({ shouldUpdate: shUp })).to.throw(AssertionError);
                });
            });

            it('should call shouldUpdate immediately with two equal params', function() {
                sub = instance.observe({ next: identity });

                expect(shouldUpdate).to.have.been.called.once().with.exactly(initial, initial);
            });
        });

        describe('template', function() {
            let template, next;

            beforeEach(function() {
                next = {
                    type: 'image',
                    text: 'A picture'
                };
                template = chai.spy(() => '<div class="image">A picture</div>');

                setup({ template });
            });

            it('should throw without function', function() {
                const invalid = [{}, 'string', 2, true, []];

                invalid.forEach(templ => {
                    expect(() => component({ template: templ })).to.throw(AssertionError);
                });
            });

            it('should update element with new state', function(done) {
                sub = instance.observe();
                state$.plug(constant(next));

                // Have to wait for render.
                requestAnimationFrame(() => {
                    // Delay a bit to ensure render is complete.
                    setTimeout(() => {
                        expect(template).to.have.been.called.once().with(next);
                        expect(fixture).to.not.have.class('text');
                        expect(fixture).to.have.class('image');
                        expect(fixture).to.have.text('A picture');

                        done();
                    }, 50);
                });
            });
        });
    });

    afterEach(function() {
        if (sub) {
            sub.unsubscribe();
        }
    });
});
