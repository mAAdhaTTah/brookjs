/* eslint-env mocha */
import 'es6-weak-map/implement';
import R from 'ramda';
import { AssertionError } from 'assert';
import { constant, never, pool } from 'kefir';

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import children from '../';

chai.use(sinonChai);

describe('children', () => {
    let child$, factory, adapter, generator, element, firstChild, props$, instance, sub;

    beforeEach(() => {
        child$ = pool();
        factory = sinon.spy(() => child$);
        adapter = sinon.spy(R.identity);
        generator = children({ child: { factory, adapter } });

        element = document.createElement('div');
        element.setAttribute('data-brk-container', 'parent');
        firstChild = createChild();
        element.appendChild(firstChild);

        props$ = never();

        document.body.appendChild(element);
        instance = generator(element, props$);
    });

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
        expect(generator).to.be.a('function');
    });

    it('should bind to child with matching key', () => {
        expect(factory).to.have.callCount(1);
        expect(factory).to.have.been.calledWith(firstChild, props$);
    });

    it('should emit child events', () => {
        const value = sinon.spy();
        const next = { type: 'ACTION' };

        sub = instance.observe({ value });
        child$.plug(constant(next));

        expect(value).to.have.callCount(1);
        expect(value).to.have.been.calledWith(next);
    });

    it('should bind to new child element', done => {
        const value = sinon.spy();
        sub = instance.observe({ value });

        let secondChild = createChild();
        element.appendChild(secondChild);

        requestAnimationFrame(() => {
            expect(value).to.have.callCount(0);
            expect(factory).to.have.callCount(2);
            expect(factory).to.have.been.calledWith(secondChild, props$);
            done();
        });
    });

    it('should not bind to grandchild element', done => {
        const value = sinon.spy();
        sub = instance.observe({ value });

        let secondChild = createChild();
        firstChild.appendChild(secondChild);

        requestAnimationFrame(() => {
            expect(value).to.have.callCount(0);
            expect(factory).to.have.callCount(1);
            done();
        });
    });

    it('should unbind when element removed', done => {
        const value = sinon.spy();
        sub = instance.observe({ value });

        element.removeChild(firstChild);

        requestAnimationFrame(() => {
            expect(instance.child._curSources.length).is.equal(0);
            done();
        });
    });

    afterEach(() => {
        if (sub) {
            sub.unsubscribe();
            sub = undefined;
        }

        document.body.removeChild(element);
    });

    function createChild() {
        let child = document.createElement('div');
        // @todo use common container attribute
        child.setAttribute('data-brk-container', 'child');
        return child;
    }
});
