/* eslint-env mocha */
import 'es6-weak-map/implement';

import { AssertionError } from 'assert';
import { constant } from 'kefir';

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
        let { generator } = createFixture();

        expect(generator).to.be.a('function');
    });

    it('should bind to child with matching key', () => {
        let { factory, firstChild, instance, modifyChildProps, props$, preplug, child$ } = createFixture();
        let sub = instance.observe();

        expect(factory).to.have.callCount(1);
        expect(factory).to.have.been.calledWith(firstChild, props$);

        expect(modifyChildProps).to.have.callCount(1);
        expect(modifyChildProps).to.have.been.calledWith(props$);

        expect(preplug).to.have.callCount(1);
        expect(preplug).to.have.been.calledWith(child$);

        sub.unsubscribe();
    });

    it('should emit child events', () => {
        const value = sinon.spy();
        const next = { type: 'ACTION' };

        let { instance, child$ } = createFixture();

        let sub = instance.observe({ value });
        child$.plug(constant(next));

        expect(value).to.have.callCount(1);
        expect(value).to.have.been.calledWith(next);

        sub.unsubscribe();
    });

    it('should bind to new child element', done => {
        let { factory, element, instance, modifyChildProps, props$, preplug, child$ } = createFixture();
        let sub = instance.observe();

        let secondChild = createChild();
        element.appendChild(secondChild);

        requestAnimationFrame(() => {
            expect(factory).to.have.callCount(2);
            expect(factory).to.have.been.calledWith(secondChild, props$);

            expect(modifyChildProps).to.have.callCount(2);
            expect(modifyChildProps).to.have.been.calledWith(props$);

            expect(preplug).to.have.callCount(2);
            expect(preplug).to.have.been.calledWith(child$);

            sub.unsubscribe();

            done();
        });
    });

    it('should bind to new subchild element', done => {
        let { factory, element, instance, modifyChildProps, props$, preplug, child$ } = createFixture();
        let sub = instance.observe();

        let nesting = document.createElement('div');
        let secondChild = createChild();

        nesting.appendChild(secondChild);
        element.appendChild(nesting);

        requestAnimationFrame(() => {
            expect(factory).to.have.callCount(2);
            expect(factory).to.have.been.calledWith(secondChild, props$);

            expect(modifyChildProps).to.have.callCount(2);
            expect(modifyChildProps).to.have.been.calledWith(props$);

            expect(preplug).to.have.callCount(2);
            expect(preplug).to.have.been.calledWith(child$);

            sub.unsubscribe();

            done();
        });
    });

    it('should not bind to grandchild element', done => {
        let { instance, firstChild, factory } = createFixture();
        const value = sinon.spy();
        let sub = instance.observe({ value });

        let secondChild = createChild();
        firstChild.appendChild(secondChild);

        requestAnimationFrame(() => {
            expect(value).to.have.callCount(0);
            expect(factory).to.have.callCount(1);

            sub.unsubscribe();

            done();
        });
    });

    it('should unbind when element removed', done => {
        let { instance, element, firstChild } = createFixture();
        const value = sinon.spy();
        let sub = instance.observe({ value });

        element.removeChild(firstChild);

        requestAnimationFrame(() => {
            // Since we changed the implementation, we need to unwrap the
            // combined stream to check the sources of the underlying pool.
            // @todo figure out a better way to check this
            // @todo w/o leaning on implementation details
            expect(instance.child._curSources[0]._curSources.length).is.equal(0);

            sub.unsubscribe();

            done();
        });
    });
});
