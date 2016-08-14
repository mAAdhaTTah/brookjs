/*eslint-env mocha */
import 'es6-weak-map/implement';
import { AssertionError } from 'assert';

import { constant, Observable, never, pool } from 'kefir';
import R, { F, identity, map } from 'ramda';

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import dom from 'chai-dom';
import simulant from 'simulant';

import component from '../index';
import { CONTAINER_ATTRIBUTE, EVENT_ATTRIBUTES, clickEvent } from '../../events/index';

chai.use(dom);
chai.use(sinonChai);

describe('component', function() {
    let factory, fixture, pluggable$, state$, instance, initial, sub;
    let fixturize = identity;

    function setup (config = {}) {
        initial = {
            type: 'text',
            text: 'Hello world!'
        };

        factory = component(config);

        fixture = document.createElement('div');
        fixture.classList.add(initial.type);
        fixture.textContent = initial.text;

        fixture = fixturize(fixture);

        pluggable$ = pool();
        pluggable$.plug(constant(initial));

        state$ = pluggable$.toProperty();

        instance = factory(fixture, state$);
    }

    describe('module', function() {
        beforeEach(function() {
            setup();
        });

        it('should be a function', function() {
            expect(component).to.be.a('function');
        });

        it('should return a factory function', function() {
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
            expect(instance).to.be.an.instanceof(Observable);
        });
    });

    describe('config', function() {
        describe('events', function() {
            let events;

            beforeEach(function() {
                events = { onclick: map(clickEvent) };
                fixturize = fixture => {
                    fixture.setAttribute(CONTAINER_ATTRIBUTE, 'fixture');
                    fixture.setAttribute(EVENT_ATTRIBUTES.click, Object.keys(events).pop());
                    document.body.appendChild(fixture);

                    return fixture;
                };

                setup({ events });
            });

            it('should throw without an object (deprecated) or function', function () {
                const invalid = ['string', 2, true];

                invalid.forEach(vnts => {
                    expect(() => component({ events: vnts }), `${typeof vnts} did not throw`).to.throw(AssertionError);
                });
            });

            it('should throw if object value is not a function (deprecated)', function () {
                const invalid = [{}, 'string', 2, true, []];

                invalid.forEach(cb => {
                    expect(() => component({ events: { cb } }), `${typeof cb} did not throw`).to.throw(AssertionError);
                });
            });

            it('should emit DOM event (deprecated)', function () {
                const value = sinon.spy();
                sub = instance.observe({ value });

                const event = simulant.fire(fixture, 'click');

                expect(value).to.have.been.calledWithMatch(clickEvent(event));
            });

            afterEach(function() {
                document.body.removeChild(fixture);
                fixturize = identity;
            });
        });

        describe('render', () => {
            let render;

            beforeEach(() => {
                render = sinon.spy(() => never());
                setup({ render: R.curryN(3, render) });
            });

            it('should throw if not a function', () => {
                const invalid = ['string', 2, true, {}];

                invalid.forEach(rndr => {
                    expect(() => component({ render: rndr }), `${typeof rndr} did not throw`).to.throw(AssertionError);
                });
            });

            it('should get called with el, prev, & next', () => {
                const next = {
                    type: 'img',
                    text: 'House'
                };

                const value = sinon.spy();
                sub = instance.observe({ value });

                pluggable$.plug(constant(next));

                expect(render).to.have.callCount(2);
                render.args.forEach(call => {
                    expect(call.length).to.equal(3);
                });

                let [el, init, nex] = render.args[1];

                expect(el).to.equal(fixture);
                expect(init).to.equal(initial);
                expect(nex).to.equal(next);
            });
        });

        describe('onMount', function () {
            let onMount, return$;

            beforeEach(function() {
                return$ = pool();
                onMount = sinon.spy(() => return$);

                setup({ onMount });
            });

            it('should throw without function', function() {
                const invalid = [{}, 'string', 2, true, []];

                invalid.forEach(onMnt => {
                    expect(() => component({ onMount: onMnt })).to.throw(AssertionError);
                });
            });

            it('should call onMount once with el and state$', function() {
                sub = instance.observe({ value: identity });

                expect(onMount).to.have.callCount(1);
                expect(onMount).to.have.been.calledWithExactly(fixture, state$);
            });

            it('should propagate stream events', function() {
                const value = sinon.spy();
                const state = {
                    type: 'EVENT_NAME',
                    payload: {
                        value: 'some value'
                    }
                };

                sub = instance.observe({ value });
                return$.plug(constant(state));

                expect(value).to.have.been.calledWithExactly(state);
            });
        });

        describe('shouldUpdate', function() {
            let shouldUpdate;

            beforeEach(function() {
                shouldUpdate = sinon.spy(F);
                setup({ shouldUpdate });
            });

            it('should throw without function', function() {
                const invalid = [{}, 'string', 2, true, []];

                invalid.forEach(shUp => {
                    expect(() => component({ shouldUpdate: shUp })).to.throw(AssertionError);
                });
            });

            it('should call shouldUpdate immediately with two equal params', function() {
                sub = instance.observe({ value: identity });

                expect(shouldUpdate).to.have.callCount(1);
                expect(shouldUpdate).to.have.been.calledWithExactly(initial, initial);
            });
        });
    });

    afterEach(function() {
        if (sub) {
            sub.unsubscribe();
        }
    });
});
