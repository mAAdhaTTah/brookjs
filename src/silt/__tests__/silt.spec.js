/* eslint-env mocha */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import simulant from 'simulant';

import R from 'ramda';
import { constant, never, pool } from 'kefir';

import { CLICK, CONTAINER_ATTRIBUTE, EVENT_ATTRIBUTES, KEYPRESS } from '../../constants';
import { containerAttribute } from '../../helpers';
import silt from '../';

chai.use(sinonChai);

describe('silt', () => {
    it('should throw if no container attribute provided', () => {
        expect(() => silt`<div></div>`).to.throw(Error);
    });

    it('should return a function', () => {
        const Component = silt`<div ${containerAttribute('fixture')}></div>`;

        expect(Component).to.be.a('function');
    });

    it('should call onMount', () => {
        const spy = sinon.spy(() => never());
        const onMount = silt.onMount(spy);
        const Component = silt`<div ${containerAttribute('fixture')} ${onMount}></div>`;
        const fixture = document.createElement('div');
        const props$ = never();

        const sub = Component(fixture, props$).observe({});

        expect(spy).to.have.callCount(1);
        expect(spy).to.have.been.calledWith(fixture, props$);

        sub.unsubscribe();
    });

    it('should emit event', () => {
        const event = { type: 'CLICK' };
        const spy = sinon.spy(e$ => e$.map(R.always(event)));
        const click = silt.event(CLICK, spy);
        const Component = silt`<div ${containerAttribute('fixture')} ${click}></div>`;
        const fixture = document.createElement('div');
        fixture.setAttribute(CONTAINER_ATTRIBUTE, 'fixture');
        fixture.setAttribute(EVENT_ATTRIBUTES[CLICK], click.$$key);
        const props$ = pool();
        let called = false;
        document.body.appendChild(fixture);
        const sub = Component(fixture, props$.toProperty(R.always({}))).observe({
            value(e) {
                called = true;
                expect(e).to.equal(event);
            }
        });
        simulant.fire(fixture, 'click');

        expect(spy).to.have.callCount(1);
        expect(called).to.equal(true);

        document.body.removeChild(fixture);
        sub.unsubscribe();
    });

    it('should handle multiple events', () => {
        const clickAction = { type: 'CLICK' };
        const clickCallback = sinon.spy(e$ => e$.map(R.always(clickAction)));
        const click = silt.event(CLICK, clickCallback);

        const keypressAction = { type: 'KEYPRESS' };
        const keypressCallback = sinon.spy(e$ => e$.map(R.always(keypressAction)));
        const keypress = silt.event(KEYPRESS, keypressCallback);

        const Component = silt`<div ${containerAttribute('fixture')} ${click} ${keypress}></div>`;

        const fixture = document.createElement('div');
        fixture.setAttribute(CONTAINER_ATTRIBUTE, 'fixture');
        fixture.setAttribute(EVENT_ATTRIBUTES[CLICK], click.$$key);
        fixture.setAttribute(EVENT_ATTRIBUTES[KEYPRESS], keypress.$$key);

        const props$ = pool();

        let called = 0;
        document.body.appendChild(fixture);
        const sub = Component(fixture, props$.toProperty(R.always({}))).observe({
            value(e) {
                if (!called) {
                    expect(e).to.equal(clickAction);
                } else {
                    expect(e).to.equal(keypressAction);
                }

                called++;
            }
        });
        simulant.fire(fixture, 'click');
        simulant.fire(fixture, 'keypress');

        expect(clickCallback).to.have.callCount(1);
        expect(called).to.equal(2);

        document.body.removeChild(fixture);
        sub.unsubscribe();
    });

    it('should update the element to match the template', done => {
        const props$ = pool();
        const Component = silt`<div ${containerAttribute('fixture')}>
    {{#if enabled}}Enabled{{else}}Disabled{{/if}}
</div>`;
        const fixture = document.createElement('div');
        fixture.setAttribute(CONTAINER_ATTRIBUTE, 'fixture');
        fixture.textContent = 'Disabled';

        const sub = Component(fixture, props$).observe({});

        props$.plug(constant({ enabled: true }));

        requestAnimationFrame(() => {
            expect(fixture.textContent.trim()).to.equal('Enabled');

            props$.plug(constant({ enabled: false }));

            requestAnimationFrame(() => {
                expect(fixture.textContent.trim()).to.equal('Disabled');

                sub.unsubscribe();

                done();
            });
        });
    });

    it('should mount the child component', done => {
        const props$ = pool();
        const clickAction = { type: 'CLICK' };
        const clickCallback = sinon.spy(e$ => e$.map(R.always(clickAction)));
        const click = silt.event(CLICK, clickCallback);
        const Child = silt`<div ${containerAttribute('child')}><button ${click}>{{button.text}}</button></div>`;

        const preplug = sinon.spy(R.identity);
        const child = silt.child(Child, { preplug });

        const Parent = silt`<div ${containerAttribute('parent')}>${child}</div>`;

        const childFixture = document.createElement('div');
        childFixture.setAttribute(CONTAINER_ATTRIBUTE, 'child');
        const button = document.createElement('button');
        button.setAttribute(EVENT_ATTRIBUTES[CLICK], click.$$key);
        button.textContent = 'Click me';
        childFixture.appendChild(button);
        const fixture = document.createElement('div');
        fixture.setAttribute(CONTAINER_ATTRIBUTE, 'parent');
        fixture.appendChild(childFixture);

        document.body.appendChild(fixture);

        const instance$ = Parent(fixture, props$);

        props$.plug(constant({
            button: { text: 'Click me' }
        }));

        let called;

        const sub = instance$.observe({
            value(val) {
                called = true;

                expect(val).to.equal(clickAction);
            }
        });

        expect(preplug).to.have.callCount(1);
        expect(clickCallback).to.have.callCount(1);

        simulant.fire(button, 'click');

        expect(called).to.equal(true);

        props$.plug(constant({
            button: { text: 'Do not click me' }
        }));

        requestAnimationFrame(() => {
            expect(button.textContent).to.eql('Do not click me');

            document.body.removeChild(fixture);
            sub.unsubscribe();

            done();
        });
    });
});
