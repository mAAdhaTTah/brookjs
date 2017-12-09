/*eslint-env mocha */
import 'core-js/shim';
import { AssertionError } from 'assert';
import R from 'ramda';
import { use, expect } from 'chai';
import hbs from 'handlebars';
import { createElementFromTemplate, cleanup, chaiPlugin } from 'brookjs-desalinate';
import simulant from 'simulant';
import Kefir from '../../kefir';
import { SUPPORTED_EVENTS } from '../constants';
import { blackboxAttribute, containerAttribute, keyAttribute, eventAttribute } from '../helpers';
import { component, children, events, render } from '../';
import { simpleUpdate, updateChild, hideBlackboxed, rootBlackboxed, chooseEvent, toggleChild, toggleSubChild, toggled, withToggledChild } from './fixtures';

const { plugin, prop, send, value } = chaiPlugin({ Kefir });

use(plugin);

hbs.registerHelper('blackbox', attr => new hbs.SafeString(blackboxAttribute(attr)));
hbs.registerHelper('container', attr => new hbs.SafeString(containerAttribute(attr)));
hbs.registerHelper('key', attr => new hbs.SafeString(keyAttribute(attr)));
hbs.registerHelper('event', (...args) => new hbs.SafeString(eventAttribute(...args)));

hbs.registerPartial('child/toggled', toggled);
hbs.registerPartial('child/withToggledChild', withToggledChild);

const effect$$WithSource = source => effect$$ => effect$$.map(effect$ => Object.assign(effect$, { $meta: {
    ...effect$.$meta,
    source
} }));

const SimpleUpdateComponent = component({
    render: render(simpleUpdate, effect$$WithSource('SimpleUpdateComponent'))
});

const ChildComponent = component({
    render: render(() => '', effect$$WithSource('ChildComponent'))
});

const UpdateChildComponent = component({
    children: children({ child: ChildComponent }),
    render: render(updateChild, effect$$WithSource('UpdateChildComponent'))
});

const HideBlackBoxedComponent = component({
    render: render(hideBlackboxed, effect$$WithSource('HideBlackBoxedComponent'))
});

const RootBlackBoxedComponent = component({
    render: render(rootBlackboxed, effect$$WithSource('RootBlackBoxedComponent'))
});

const ChooseEventComponent = component({
    events: events({
        onevent: e$ => e$.map(({ containerTarget, decoratedTarget, defaultPrevented }) => ({
            type: 'event',
            e: {
                containerTarget,
                decoratedTarget,
                defaultPrevented
            }
        }))
    }),
    render: render(chooseEvent, effect$$WithSource('ChooseEventComponent'))
});
const ToggledComponent = component({
    events: events({
        onClick: evt$ => evt$.map(() => ({
            type: 'CLICK'
        }))
    }),
    render: render(toggled, effect$$WithSource('ToggledComponent'))
});

const WithToggledChildComponent = component({
    children: children({ toggled: ToggledComponent }),
    render: render(toggleChild, effect$$WithSource('WithToggledChildComponent'))
});

const WithToggledSubChildComponent = component({
    children: children({ withToggledChild: WithToggledChildComponent }),
    render: render(toggleSubChild, effect$$WithSource('WithToggledSubChildComponent'))
});


describe('component', () => {
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

        it('should update element with new state', () => {
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

            expect(SimpleUpdateComponent(el, props$)).to.emitInTime([], (tick, clock) => {
                send(props$, [value(next)]);
                clock.runToFrame();
                expect(el.outerHTML).to.equal(simpleUpdate(next).trim());
            });
        });

        it('should update child element', () => {
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

            expect(UpdateChildComponent(el, props$)).to.emitInTime([], (tick, clock) => {
                send(props$, [value(next)]);
                clock.runToFrame();
                expect(el.outerHTML).to.equal(updateChild(next).trim());
            });
        });

        it('should add missing child container element', () => {
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

            expect(UpdateChildComponent(el, props$)).to.emitInTime([], (tick, clock) => {
                send(props$, [value(next)]);
                clock.runToFrame();
                expect(el.outerHTML).to.equal(updateChild(next).trim());
            });
        });

        it('should remove extra child container element', () => {
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

            expect(UpdateChildComponent(el, props$)).to.emitInTime([], (tick, clock) => {
                send(props$, [value(next)]);
                clock.runToFrame();
                expect(el.outerHTML).to.equal(updateChild(next).trim());
            });
        });

        it('should remove and modify children with matching keys', () => {
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

            expect(UpdateChildComponent(el, props$)).to.emitInTime([], (tick, clock) => {
                send(props$, [value(next)]);
                clock.runToFrame();
                expect(el.outerHTML).to.equal(updateChild(next).trim());
                // Check that the proper element was removed
                expect(el.contains(child1)).to.equal(false);
                expect(el.contains(child2)).to.equal(true);
            });
        });

        it('should not update blackboxed element', () => {
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

            expect(HideBlackBoxedComponent(el, props$)).to.emitInTime([], (tick, clock) => {
                send(props$, [value(next)]);
                clock.runToFrame();
                expect(el.outerHTML).to.equal(hideBlackboxed({
                    // New headline
                    headline: 'Blackboxed Headline',
                    // Previous children
                    blackboxed: [{ text: 'Blackboxed 1 Text', id: '1' }]
                }).trim());
            });
        });

        it('should not update blackboxed element if modified between renders', () => {
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

            expect(HideBlackBoxedComponent(el, props$)).to.emitInTime([], (tick, clock) => {
                send(props$, [value(next)]);
                clock.runToFrame();

                const blackboxed = el.querySelector('[data-brk-blackbox="1"]');
                blackboxed.textContent = modifiedTextContent;

                send(props$, [value(final)]);

                clock.runToFrame();

                expect(el.outerHTML).to.equal(hideBlackboxed({
                    headline: 'Blackboxed Final',
                    blackboxed: [{ text: 'Blackboxed 1 Modified Text', id: '1' }]
                }).trim());
            });
        });

        it('should add missing blackboxed element', () => {
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

            expect(HideBlackBoxedComponent(el, props$)).to.emitInTime([], (tick, clock) => {
                send(props$, [value(next)]);
                clock.runToFrame();
                expect(el.outerHTML).to.equal(hideBlackboxed({
                    headline: 'Blackboxed Next',
                    blackboxed: [{ text: 'Blackboxed 1 Text', id: '1' }, { text: 'Blackboxed 2 Text', id: '2' }]
                }).trim());
            });
        });

        it('should remove extra blackboxed element', () => {
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

            expect(HideBlackBoxedComponent(el, props$)).to.emitInTime([], (tick, clock) => {
                send(props$, [value(next)]);
                clock.runToFrame();

                const [one, two] = el.querySelectorAll('[data-brk-blackbox]');

                expect(one.textContent).to.equal(initial.blackboxed[0].text);
                expect(two).to.equal(undefined);
            });
        });

        it('should render root blackboxed element', () => {
            const initial = {
                text: 'Initial text'
            };
            const next = {
                text: 'Next text'
            };
            const props$ = send(prop(), [value(initial)]);
            const el = createElementFromTemplate(rootBlackboxed, initial);

            expect(RootBlackBoxedComponent(el, props$)).to.emitInTime([], (tick, clock) => {
                send(props$, [value(next)]);
                clock.runToFrame();
                expect(el.outerHTML).to.equal(rootBlackboxed(next).trim());
            });
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
                    const el = createElementFromTemplate(chooseEvent, { targets: [{ customEvent: event }] });
                    const target = el.querySelector('input');

                    expect(ChooseEventComponent(el, prop())).to.emit([value({ type: 'event', e: {
                        containerTarget: el,
                        decoratedTarget: target,
                        defaultPrevented: false
                    } })], () => {
                        simulant.fire(target, event);
                    });
                });
            }
        });

        it('should only emit events for the triggered element', () => {
            const el = createElementFromTemplate(chooseEvent, { targets: [{ customEvent: 'input' }, { customEvent: 'input' }, { customEvent: 'input' }] });
            const target = el.querySelector('input');

            expect(ChooseEventComponent(el, prop())).to.emit([value({ type: 'event', e: {
                containerTarget: el,
                decoratedTarget: target,
                defaultPrevented: false
            } })], () => {
                simulant.fire(target, 'input');
            });
        });
    });

    describe('children', () => {
        it('should throw with invalid config typed', () => {
            const invalid = ['string', 2, true];

            invalid.forEach(config => {
                expect(() => {
                    component({
                        children: children(config)
                    });
                }, `${typeof config} did not throw`).to.throw(AssertionError);
            });
        });

        it('should throw if children config not an object or function', () => {
            const invalid = ['string', 2, true];

            invalid.forEach(config => {
                expect(() => {
                    component({
                        children: children({ config })
                    });
                }, `${typeof config} did not throw`).to.throw(AssertionError);
            });
        });

        it('should emit child events', () => {
            const initial = {
                show: true
            };
            const el = createElementFromTemplate(toggleChild, initial);
            const props$ = send(prop(), [value(initial)]);

            expect(WithToggledChildComponent(el, props$)).to.emitInTime([[0, value({ type: 'CLICK' })]], () => {
                simulant.fire(el.querySelector('button'), 'click');
            });
        });

        it('should bind to new child', () => {
            const initial = {
                show: false
            };
            const next = {
                show: true
            };
            const el = createElementFromTemplate(toggleChild, initial);
            const props$ = send(prop(), [value(initial)]);

            expect(WithToggledChildComponent(el, props$)).to.emitInTime([[16, value({ type: 'CLICK' })]], (tick, clock) => {
                send(props$, [value(next)]);
                clock.runToFrame();
                simulant.fire(el.querySelector('button'), 'click');
            });
        });

        it('should unbind to removed child element', () => {
            const initial = {
                show: true
            };
            const next = {
                show: false
            };
            const el = createElementFromTemplate(toggleChild, initial);
            const button = el.querySelector('button');
            const props$ = send(prop(), [value(initial)]);

            expect(WithToggledChildComponent(el, props$)).to.emitInTime([], (tick, clock) => {
                send(props$, [value(next)]);
                clock.runToFrame();
                simulant.fire(button, 'click');
            });
        });

        it('should bind to new subchild element', () => {
            const initial = {
                show: false
            };
            const next = {
                show: true
            };
            const el = createElementFromTemplate(toggleSubChild, initial);
            const props$ = send(prop(), [value(initial)]);

            expect(WithToggledSubChildComponent(el, props$)).to.emitInTime([[16, value({ type: 'CLICK' })]], (tick, clock) => {
                send(props$, [value(next)]);
                clock.runToFrame();
                simulant.fire(el.querySelector('button'), 'click');
            });
        });
    });

    describe('animation', () => {
        it('should throw if modifyEffect$$ is not a function', () => {
            const invalid = [{}, 'string', 2, true, []];

            invalid.forEach(modifyEffect$$ => {
                expect(() => {
                    component({
                        render: render(simpleUpdate, modifyEffect$$)
                    });
                }).to.throw(AssertionError);
            });
        });

        it('should emit effects from simple render', () => {
            const initial = {
                type: 'text',
                text: 'Hello world!'
            };
            const next = {
                type: 'image',
                text: 'Goodbye World!'
            };
            const el = createElementFromTemplate(simpleUpdate, initial);
            const props$ = send(prop(), [value(initial)]);

            const expected = [
                [16, value({
                    type: 'SET_ATTRIBUTE',
                    source: 'SimpleUpdateComponent',
                    container: el,
                    target: el,
                    attr: 'class',
                    value: 'image'
                })],
                [16, value({ type: 'NODE_VALUE',
                    source: 'SimpleUpdateComponent',
                    container: el,
                    target: el.firstChild,
                    value: 'Goodbye World!'
                })],
                [16, value({ type: 'END' })]
            ];
            expect(SimpleUpdateComponent(el, props$)).to.emitEffectsInTime(expected, frame => {
                send(props$, [value(next)]);
                frame();
            });
        });

        it('should emit effects from attached child element', () => {
            const initial = {
                show: false
            };
            const next = {
                show: true
            };
            const el = createElementFromTemplate(toggleChild, initial);
            const props$ = send(prop(), [value(initial)]);

            const expected = [
                [16, value({
                    type: 'INSERT_NODE',
                    source: 'WithToggledChildComponent',
                    container: el,
                    incoming: 'ADDED BELOW',
                    parent: el,
                    reference: null
                })],
                [16, value({ type: 'END' })]
            ];
            expect(WithToggledChildComponent(el, props$)).to.emitEffectsInTime(expected, frame => {
                send(props$, [value(next)]);
                frame();

                // @todo Need to replace with a matcher or something.... but it gets us thru.
                expected[0][1].value.incoming = el.querySelector('button').parentNode;
            });
        });

        it('should emit effects from attached subchild element', () => {
            const initial = {
                show: false
            };
            const next = {
                show: true
            };
            const el = createElementFromTemplate(toggleSubChild, initial);
            const props$ = send(prop(), [value(initial)]);

            const expected = [
                [16, value({
                    type: 'INSERT_NODE',
                    source: 'WithToggledChildComponent',
                    container: el.querySelector('.with-subchild'),
                    incoming: 'ADDED BELOW',
                    parent: el.querySelector('.with-subchild'),
                    reference: null
                })],
                [16, value({ type: 'END' })]
            ];
            expect(WithToggledSubChildComponent(el, props$)).to.emitEffectsInTime(expected, frame => {
                send(props$, [value(next)]);
                frame();

                // @todo Need to replace with a matcher or something.... but it gets us thru.
                expected[0][1].value.incoming = el.querySelector('button');
            });
        });
    });

    afterEach(() => {
        cleanup();
    });
});
