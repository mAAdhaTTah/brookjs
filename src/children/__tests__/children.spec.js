/* eslint-env mocha */
import 'core-js/shim';

import { AssertionError } from 'assert';
import Kefir from '../../kefir';

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { createFixture, createChild } from './util';
import children from '../';

chai.use(sinonChai);

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
        const value = sinon.spy();
        const next = { type: 'ACTION' };

        const { instance, child$ } = createFixture();

        const sub = instance.observe({ value });
        child$.plug(Kefir.constant(next));

        expect(value).to.have.callCount(1);
        expect(value).to.have.been.calledWith(next);

        sub.unsubscribe();
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
        const value = sinon.spy();
        const next = { type: 'ACTION' };
        const sub = instance.observe({ value });

        element.removeChild(firstChild);

        requestAnimationFrame(() => {
            child$.plug(Kefir.constant(next));
            expect(value).to.have.callCount(0);

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
