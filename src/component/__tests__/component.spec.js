/*eslint-env mocha */
import 'es6-weak-map/implement';
import { AssertionError } from 'assert';

import R from 'ramda';
import Kefir from '../../kefir';

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import dom from 'chai-dom';

import component from '../index';

chai.use(dom);
chai.use(sinonChai);

describe('component', function() {
    let factory, fixture, pluggable$, props$, instance, initial, sub;

    function setup (config = {}) {
        initial = {
            type: 'text',
            text: 'Hello world!'
        };

        factory = component(config);

        fixture = document.createElement('div');
        fixture.classList.add(initial.type);
        fixture.textContent = initial.text;

        pluggable$ = Kefir.pool();
        pluggable$.plug(Kefir.constant(initial));

        props$ = pluggable$.toProperty();

        instance = factory(fixture, props$);
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
            const invalid = [{}, 'string', 2, true, [], R.identity];

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
            expect(instance).to.be.an.instanceof(Kefir.Observable);
        });
    });

    describe('config', function() {
        describe('events', function() {
            let events;

            beforeEach(function() {
                events = sinon.spy(() => Kefir.never());
                setup({ events });
                document.body.appendChild(fixture);
            });

            it('should throw without a function', function () {
                const invalid = ['string', 2, true, {}];

                invalid.forEach(vnts => {
                    expect(() => component({ events: vnts }), `${typeof vnts} did not throw`).to.throw(AssertionError);
                });
            });

            it.skip('should get called on mount with el');
            it.skip('should get called on render end with el');

            afterEach(function() {
                document.body.removeChild(fixture);
            });
        });

        describe('render', () => {
            let render;

            beforeEach(() => {
                render = sinon.spy(() => Kefir.never());
                setup({ render: R.curryN(2, render) });
            });

            it('should throw if not a function', () => {
                const invalid = ['string', 2, true, {}];

                invalid.forEach(rndr => {
                    expect(() => component({ render: rndr }), `${typeof rndr} did not throw`).to.throw(AssertionError);
                });
            });

            it('should get called with el & modified props$', () => {
                const value = sinon.spy();
                sub = instance.observe({ value });

                const [el/*, props*/] = render.args[0];

                expect(render).to.have.callCount(1);
                expect(el).to.equal(fixture);
                // expect(props).to.equal(props$); @todo validate stream
            });
        });

        describe('onMount', function () {
            let onMount, return$;

            beforeEach(function() {
                return$ = Kefir.pool();
                onMount = sinon.spy(() => return$);

                setup({ onMount });
            });

            it('should throw without function', function() {
                const invalid = [{}, 'string', 2, true, []];

                invalid.forEach(onMnt => {
                    expect(() => component({ onMount: onMnt })).to.throw(AssertionError);
                });
            });

            it('should call onMount once with el and props$', function() {
                sub = instance.observe({ value: R.identity });

                expect(onMount).to.have.callCount(1);
                expect(onMount).to.have.been.calledWithExactly(fixture, props$);
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
                return$.plug(Kefir.constant(state));

                expect(value).to.have.been.calledWithExactly(state);
            });
        });
    });

    afterEach(function() {
        if (sub) {
            sub.unsubscribe();
        }
    });
});
