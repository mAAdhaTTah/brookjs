/* eslint-env mocha */
import 'core-js/shim';
import R from 'ramda';import { AssertionError } from 'assert';
import Kefir from '../../../kefir';

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiKefir from 'chai-kefir';
import { CONTAINER_ATTRIBUTE, KEY_ATTRIBUTE, $$internals } from '../../constants';
import children from '../';

const { plugin, send, value, prop, stream } = chaiKefir(Kefir);

chai.use(sinonChai);
chai.use(plugin);

describe('children', () => {
    it('should throw if config not an object or function', () => {
        const invalid = ['string', 2, true];

        invalid.forEach(config => {
            expect(() => children(config), `${typeof config} did not throw`).to.throw(AssertionError);
        });
    });

    it('should throw if children config not an object or function', () => {
        const invalid = ['string', 2, true];

        invalid.forEach(config => {
            expect(() => children({ config }), `${typeof config} did not throw`).to.throw(AssertionError);
        });
    });

    it('should be a function', () => {
        const { generator } = createFixture();

        expect(generator).to.be.a('function');
    });

    it('should bind to child with matching key', () => {
        const { factory, firstChild, instance, modifyChildProps, props$, preplug, child$ } = createFixture();
        const sub = instance.observe();

        expect(factory).to.have.callCount(1);
        expect(factory).to.have.been.calledWith(firstChild, props$);

        expect(modifyChildProps).to.have.callCount(1);
        expect(modifyChildProps).to.have.been.calledWith(props$, '1');

        expect(preplug).to.have.callCount(1);
        expect(preplug).to.have.been.calledWith(child$);

        sub.unsubscribe();
    });

    it('should emit child events', () => {
        const next = { type: 'ACTION' };

        const { instance, child$ } = createFixture();

        expect(instance).to.emit([value(next)], () => {
            send(child$, [value(next)]);
        });
    });

    it('should bind to new child element', done => {
        const { factory, element, instance, modifyChildProps, props$, preplug, child$ } = createFixture();
        const sub = instance.observe();

        const secondChild = createChild('2');
        element.appendChild(secondChild);

        requestAnimationFrame(() => {
            expect(factory).to.have.callCount(2);
            expect(factory).to.have.been.calledWith(secondChild, props$);

            expect(modifyChildProps).to.have.callCount(2);
            expect(modifyChildProps).to.have.been.calledWith(props$, '2');

            expect(preplug).to.have.callCount(2);
            expect(preplug).to.have.been.calledWith(child$);

            sub.unsubscribe();

            done();
        });
    });

    it('should bind to new subchild element', done => {
        const { factory, element, instance, modifyChildProps, props$, preplug, child$ } = createFixture();
        const sub = instance.observe();

        const nesting = document.createElement('div');
        const secondChild = createChild('2');

        nesting.appendChild(secondChild);
        element.appendChild(nesting);

        requestAnimationFrame(() => {
            expect(factory).to.have.callCount(2);
            expect(factory).to.have.been.calledWith(secondChild, props$);

            expect(modifyChildProps).to.have.callCount(2);
            expect(modifyChildProps).to.have.been.calledWith(props$, '2');

            expect(preplug).to.have.callCount(2);
            expect(preplug).to.have.been.calledWith(child$);

            sub.unsubscribe();

            done();
        });
    });

    it('should not bind to grandchild element', done => {
        const { instance, firstChild, factory } = createFixture();
        const value = sinon.spy();
        const sub = instance.observe({ value });

        const secondChild = createChild('2');
        firstChild.appendChild(secondChild);

        requestAnimationFrame(() => {
            expect(value).to.have.callCount(0);
            expect(factory).to.have.callCount(1);

            sub.unsubscribe();

            done();
        });
    });

    it('should unbind when element removed', done => {
        const { instance, element, firstChild, child$ } = createFixture();
        const spy = sinon.spy();
        const next = { type: 'ACTION' };
        const sub = instance.observe({ value: spy });

        element.removeChild(firstChild);

        requestAnimationFrame(() => {
            send(child$, [value(next)]);
            expect(spy).to.have.callCount(0);

            sub.unsubscribe();

            done();
        });
    });

    it('should only bind once when appended to subelement', done => {
        const { factory, element, instance } = createFixture();
        const value = sinon.spy();
        const sub = instance.observe({ value });

        const untaggedElement = document.createElement('div');
        element.appendChild(untaggedElement);

        const secondChild = createChild('2');
        untaggedElement.appendChild(secondChild);

        requestAnimationFrame(() => {
            expect(value).to.have.callCount(0);
            // firstChild is bound during fixture creation
            expect(factory).to.have.callCount(2);

            sub.unsubscribe();

            done();
        });
    });

    it('should not bind when subelement added and removed in single tick', done => {
        const { factory, element, instance } = createFixture();
        const value = sinon.spy();
        const sub = instance.observe({ value });

        const untaggedElement = document.createElement('div');
        element.appendChild(untaggedElement);

        const secondChild = createChild('2');
        untaggedElement.appendChild(secondChild);
        untaggedElement.removeChild(secondChild);

        requestAnimationFrame(() => {
            expect(value).to.have.callCount(0);
            // firstChild is bound during fixture creation
            expect(factory).to.have.callCount(1);

            sub.unsubscribe();

            done();
        });
    });

    it('should use createSourceStream when available', () => {
        const createSourceStream = sinon.spy(() => Kefir.never());
        const { factory, firstChild, instance, modifyChildProps, props$, preplug } = createFixture({ createSourceStream });
        const sub = instance.observe();

        expect(factory).to.have.callCount(0);
        expect(createSourceStream).to.have.callCount(1);
        expect(createSourceStream).to.have.been.calledWith(firstChild, props$);

        expect(modifyChildProps).to.have.callCount(1);
        expect(modifyChildProps).to.have.been.calledWith(props$, '1');

        expect(preplug).to.have.callCount(1);
        expect(preplug).to.have.been.calledWith(createSourceStream.getCall(0).returnValue);

        sub.unsubscribe();
    });

    it('should not use createSourceStream if called with use factory', () => {
        const createSourceStream = sinon.spy(() => Kefir.never());
        const { factory, firstChild, instance, modifyChildProps, props$, preplug } = createFixture({ createSourceStream, config: { useFactory: true } });
        const sub = instance.observe();

        expect(factory).to.have.callCount(1);
        expect(createSourceStream).to.have.callCount(0);
        expect(factory).to.have.been.calledWith(firstChild, props$);

        expect(modifyChildProps).to.have.callCount(1);
        expect(modifyChildProps).to.have.been.calledWith(props$, '1');

        expect(preplug).to.have.callCount(1);
        expect(preplug).to.have.been.calledWith(factory.getCall(0).returnValue);

        sub.unsubscribe();
    });
});

/**
 * Create new children test fixture.
 *
 * @returns {Fixture} Children test fixture.
 */
function createFixture({ child$ = stream(), factory = sinon.spy(() => child$), createSourceStream, config } = {}) {
    if (createSourceStream) {
        factory[$$internals] = { createSourceStream };
    }
    const modifyChildProps = sinon.spy(R.identity);
    const preplug = sinon.spy(R.identity);
    const generator = children({ child: { factory, modifyChildProps, preplug } });

    const element = document.createElement('div');
    element.setAttribute(CONTAINER_ATTRIBUTE, 'parent');
    const firstChild = createChild('1');
    element.appendChild(firstChild);

    const props$ = prop();

    document.body.appendChild(element);
    const instance = generator(element, props$, config);

    return { child$, factory, modifyChildProps, preplug, generator, element, firstChild, props$, instance };
}

/**
 * Create a new element with the provided key.
 *
 * @param {string} key - Child key.
 * @returns {Element} New child element.
 */
function createChild(key) {
    const child = document.createElement('div');

    child.setAttribute(CONTAINER_ATTRIBUTE, 'child');
    child.setAttribute(KEY_ATTRIBUTE, key);

    return child;
}
