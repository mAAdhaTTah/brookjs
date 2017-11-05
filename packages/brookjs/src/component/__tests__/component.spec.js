/*eslint-env mocha */
import 'core-js/shim';
import { AssertionError } from 'assert';
import R from 'ramda';
import chai, { expect } from 'chai';
import chaiKefir from 'chai-kefir';
import hbs from 'handlebars';
import { createElementFromTemplate, cleanup } from 'brookjs-desalinate';
import simulant from 'simulant';
import Kefir from '../../kefir';
import { CONTAINER_ATTRIBUTE, EVENT_ATTRIBUTES, SUPPORTED_EVENTS } from '../constants';
import { animateAttribute, blackboxAttribute, containerAttribute, keyAttribute } from '../helpers';
import { component, events, render } from '../';
import { simpleUpdate, updateChild, hideBlackboxed, rootBlackboxed } from './fixtures';

const { plugin, prop, send, value, end } = chaiKefir(Kefir);
chai.use(plugin);

hbs.registerHelper('animate', attr => new hbs.SafeString(animateAttribute(attr)));
hbs.registerHelper('blackbox', attr => new hbs.SafeString(blackboxAttribute(attr)));
hbs.registerHelper('container', attr => new hbs.SafeString(containerAttribute(attr)));
hbs.registerHelper('key', attr => new hbs.SafeString(keyAttribute(attr)));

describe('component', () => {
    describe('module', () => {
        it('should be a function', () => {
            expect(component).to.be.a('function');
        });

        it('should return a factory function', () => {
            expect(component({})).to.be.a('function');
        });
    });

    describe('factory', () => {
        it('should require an HTMLElement', () => {
            const invalid = [{}, 'string', 2, true, [], R.identity];

            invalid.forEach(el => {
                expect(() => component({})(el, {})).to.throw(AssertionError);
            });
        });

        it('should require an observable', () => {
            const invalid = [{}, 'string', 2, true, []];

            invalid.forEach(state => {
                expect(() => component({})(document.createElement('div'), state)).to.throw(AssertionError);
            });
        });

        it('should return an observable', () => {
            expect(component({})(document.createElement('div'), prop())).to.be.observable();
        });
    });

    describe('render', () => {
        it('should throw without function', () => {
            const invalid = [{}, 'string', 2, true, []];

            invalid.forEach(template => {
                expect(() => {
                    component({
                        render: render(template)
                    });
                }).to.throw(AssertionError);
            });
        });

        it('should update element with new state', done => {
            const initial = {
                type: 'text',
                text: 'Hello world!'
            };
            const next = {
                type: 'image',
                text: 'A picture'
            };
            const props$ = send(prop(), [value(initial)]);
            const el = createElementFromTemplate(simpleUpdate, initial);
            const factory = component({
                render: render(simpleUpdate)
            });

            factory(el, props$).observe({
                end() {
                    expect(el.outerHTML).to.equal(simpleUpdate(next).trim());

                    done();
                }
            });

            send(props$, [value(next), end()]);
        });

        it('should update child element', done => {
            const initial = {
                headline: 'Children',
                children: [{ text: 'Child 1 Text', id: '1' }]
            };
            const next = {
                headline: 'Children',
                children: [{ text: 'Child 1 New Text', id: '1' }]
            };
            const props$ = send(prop(), [value(initial)]);
            const el = createElementFromTemplate(updateChild, initial);
            const factory = component({
                render: render(updateChild)
            });

            factory(el, props$).observe({
                end() {
                    expect(el.outerHTML).to.equal(updateChild(next).trim());

                    done();
                }
            });

            send(props$, [value(next), end()]);
        });

        it('should add missing child container element', done => {
            const initial = {
                headline: 'Children',
                children: [{ text: 'Child 1 Text', id: '1' }]
            };
            const next = {
                headline: 'Children',
                children: [{ text: 'Child 1 Text', id: '1' }, { text: 'Child 2 Text', id: '2' }]
            };
            const props$ = send(prop(), [value(initial)]);
            const el = createElementFromTemplate(updateChild, initial);
            const factory = component({
                render: render(updateChild)
            });

            factory(el, props$).observe({
                end() {
                    expect(el.outerHTML).to.equal(updateChild(next).trim());

                    done();
                }
            });

            send(props$, [value(next), end()]);
        });

        it('should remove extra child container element', done => {
            const initial = {
                headline: 'Children',
                children: [{ text: 'Child 1 Text', id: '1' }, { text: 'Child 2 Text', id: '2' }]
            };
            const next = {
                headline: 'Children',
                children: [{ text: 'Child 1 Text', id: '1' }]
            };
            const props$ = send(prop(), [value(initial)]);
            const el = createElementFromTemplate(updateChild, initial);
            const factory = component({
                render: render(updateChild)
            });

            factory(el, props$).observe({
                end() {
                    expect(el.outerHTML).to.equal(updateChild(next).trim());

                    done();
                }
            });

            send(props$, [value(next), end()]);
        });

        it('should remove and modify children with matching keys', done => {
            const initial = {
                headline: 'Children',
                children: [{ text: 'Child 1 Text', id: '1' }, { text: 'Child 2 Text', id: '2' }]
            };
            const next = {
                headline: 'Children',
                children: [{ text: 'Child 2 New Text', id: '2' }]
            };
            const props$ = send(prop(), [value(initial)]);
            const el = createElementFromTemplate(updateChild, initial);
            const [child1, child2] = el.querySelectorAll('[data-brk-container="child"]');
            const factory = component({
                render: render(updateChild)
            });

            factory(el, props$).observe({
                end() {
                    expect(el.outerHTML).to.equal(updateChild(next).trim());
                    // Check that the proper element was removed
                    expect(el.contains(child1)).to.equal(false);
                    expect(el.contains(child2)).to.equal(true);

                    done();
                }
            });

            send(props$, [value(next), end()]);
        });

        it('should not update blackboxed element', done => {
            const initial = {
                headline: 'Blackboxed',
                blackboxed: [{ text: 'Blackboxed 1 Text', id: '1' }]
            };
            const next = {
                headline: 'Blackboxed Headline',
                blackboxed: [{ text: 'Blackboxed 1 New Text', id: '1' }]
            };
            const props$ = send(prop(), [value(initial)]);
            const el = createElementFromTemplate(hideBlackboxed, initial);
            const factory = component({
                render: render(hideBlackboxed)
            });

            factory(el, props$).observe({
                end() {
                    expect(el.outerHTML).to.equal(hideBlackboxed({
                        // New headline
                        headline: 'Blackboxed Headline',
                        // Previous children
                        blackboxed: [{ text: 'Blackboxed 1 Text', id: '1' }]
                    }).trim());
                    done();
                }
            });

            send(props$, [value(next), end()]);
        });

        it('should not update blackboxed element if modified between renders', done => {
            const initial = {
                headline: 'Blackboxed',
                blackboxed: [{ text: 'Blackboxed 1 Text', id: '1' }]
            };
            const next = {
                headline: 'Blackboxed Next',
                blackboxed: [{ text: 'Blackboxed 1 New Text', id: '1' }]
            };
            const final = {
                headline: 'Blackboxed Final',
                blackboxed: [{ text: 'Blackboxed 1 Final Text', id: '1' }]
            };
            const props$ = send(prop(), [value(initial)]);
            const modifiedTextContent = 'Blackboxed 1 Modified Text';
            const el = createElementFromTemplate(hideBlackboxed, initial);
            const factory = component({
                render: render(hideBlackboxed)
            });

            factory(el, props$).observe({
                end() {
                    expect(el.outerHTML).to.equal(hideBlackboxed({
                        headline: 'Blackboxed Final',
                        blackboxed: [{ text: 'Blackboxed 1 Modified Text', id: '1' }]
                    }).trim());

                    done();
                }
            });

            send(props$, [value(next)]);

            requestAnimationFrame(() => {
                const blackboxed = el.querySelector('[data-brk-blackbox="1"]');

                blackboxed.textContent = modifiedTextContent;

                send(props$, [value(final), end()]);
            });
        });

        it('should add missing blackboxed element', done => {
            const initial = {
                headline: 'Blackboxed Previous',
                blackboxed: [{ text: 'Blackboxed 1 Text', id: '1' }]
            };
            const next = {
                headline: 'Blackboxed Next',
                blackboxed: [{ text: 'Blackboxed 1 New Text', id: '1' }, { text: 'Blackboxed 2 Text', id: '2' }]
            };
            const props$ = send(prop(), [value(initial)]);
            const el = createElementFromTemplate(hideBlackboxed, initial);
            const factory = component({
                render: render(hideBlackboxed)
            });

            factory(el, props$).observe({
                end() {
                    expect(el.outerHTML).to.equal(hideBlackboxed({
                        headline: 'Blackboxed Next',
                        blackboxed: [{ text: 'Blackboxed 1 Text', id: '1' }, { text: 'Blackboxed 2 Text', id: '2' }]
                    }).trim());
                    done();
                }
            });

            send(props$, [value(next), end()]);
        });

        it('should remove extra blackboxed element', done => {
            const initial = {
                headline: 'Blackboxed',
                blackboxed: [{ text: 'Blackboxed 1 New Text', id: '1' }, { text: 'Blackboxed 2 Text', id: '2' }]
            };
            const next = {
                headline: 'Blackboxed',
                blackboxed: [{ text: 'Blackboxed 1 Text', id: '1' }]
            };
            const props$ = send(prop(), [value(initial)]);
            const el = createElementFromTemplate(hideBlackboxed, initial);
            const factory = component({
                render: render(hideBlackboxed)
            });

            factory(el, props$).observe({
                end() {
                    const [one, two] = el.querySelectorAll('[data-brk-blackbox]');

                    expect(one.textContent).to.equal(initial.blackboxed[0].text);
                    expect(two).to.equal(undefined);

                    done();
                }
            });

            send(props$, [value(next), end()]);
        });

        it('should render root blackboxed element', done => {
            const initial = {
                text: 'Initial text'
            };
            const next = {
                text: 'Next text'
            };
            const props$ = send(prop(), [value(initial)]);
            const el = createElementFromTemplate(rootBlackboxed, initial);
            const factory = component({
                render: render(rootBlackboxed)
            });

            factory(el, props$).observe({
                end() {
                    expect(el.outerHTML).to.equal(rootBlackboxed(next).trim());

                    done();
                }
            });

            send(props$, [value(next), end()]);
        });

        afterEach(() => {
            cleanup();
        });
    });

    describe('events', () => {
        // Source: https://stackoverflow.com/questions/2877393/detecting-support-for-a-given-javascript-event
        const isEventSupported = (() => {
            const TAGNAMES = {
                'select': 'input','change': 'input',
                'submit': 'form','reset': 'form',
                'error': 'img','load': 'img','abort': 'img'
            };
            const IE_SIMULANT_FAILURES = ['paste', 'load', 'cut'];
            function isEventSupported(eventName) {
                if (simulant.mode === 'legacy' && IE_SIMULANT_FAILURES.includes(eventName)) {
                    return false;
                }
                let el = document.createElement(TAGNAMES[eventName] || 'div');
                eventName = 'on' + eventName;
                let isSupported = (eventName in el);
                if (!isSupported) {
                    el.setAttribute(eventName, 'return;');
                    isSupported = typeof el[eventName] === 'function';
                }
                el = null;
                return isSupported;
            }
            return isEventSupported;
        })();

        SUPPORTED_EVENTS.forEach(event => {
            if (!isEventSupported(event)) {
                it.skip(`should emit ${event} event`);
            } else {
                it(`should emit ${event} event`, () => {
                    // @todo move to fixture
                    const el = document.createElement('div');
                    el.setAttribute(CONTAINER_ATTRIBUTE, 'fixture');

                    const target = document.createElement('input');
                    target.setAttribute(EVENT_ATTRIBUTES[event], 'onevent');
                    el.appendChild(target);

                    document.body.appendChild(el);

                    const factory = component({
                        events: events({
                            onevent: e$ => e$.map(({ containerTarget, decoratedTarget, defaultPrevented }) => ({
                                type: 'event',
                                e: {
                                    containerTarget,
                                    decoratedTarget,
                                    defaultPrevented
                                }
                            }))
                        })
                    });

                    expect(factory(el, prop())).to.emit([value({ type: 'event', e: {
                        containerTarget: el,
                        decoratedTarget: target,
                        defaultPrevented: false
                    } })], () => {
                        simulant.fire(target, event);
                        document.body.removeChild(el);
                    });
                });
            }
        });

        it('should only emit events for the triggered element', () => {
            const el = document.createElement('div');
            el.setAttribute(CONTAINER_ATTRIBUTE, 'fixture');
            const factory = component({
                events: events({
                    onevent: e$ => e$.map(({ containerTarget, decoratedTarget, defaultPrevented }) => ({
                        type: 'event',
                        e: {
                            containerTarget,
                            decoratedTarget,
                            defaultPrevented
                        }
                    }))
                })
            });

            let count = 0;
            while (count < 3) {
                const target = document.createElement('input');
                target.setAttribute(EVENT_ATTRIBUTES.input, 'onevent');
                target.setAttribute(EVENT_ATTRIBUTES.focus, 'dummy');
                el.appendChild(target);
                count++;
            }

            const target = el.querySelector('input');
            document.body.appendChild(el);

            expect(factory(el, prop())).to.emit([value({ type: 'event', e: {
                containerTarget: el,
                decoratedTarget: target,
                defaultPrevented: false
            } })], () => {
                simulant.fire(target, 'input');
                document.body.removeChild(el);
            });
        });
    });
});
