/* eslint-env mocha */
import { AssertionError } from 'assert';
import chai, { expect } from 'chai';
import dom from 'chai-dom';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { BLACKBOX_ATTRIBUTE, CONTAINER_ATTRIBUTE, KEY_ATTRIBUTE } from '../../constants';
import { blackboxAttribute, containerAttribute, keyAttribute } from '../../helpers';
import render from '../';

import { constant, pool } from 'kefir';

chai.use(sinonChai);
chai.use(dom);

describe('render', function() {
    const initial = {
        type: 'text',
        text: 'Hello world!'
    };
    let template, next, fixture, generator, props$, child, span, blackboxed;

    beforeEach(function() {
        props$ = pool();
        next = {
            type: 'image',
            text: 'A picture'
        };
        template = sinon.spy(() => `<div ${containerAttribute('parent')} class="image"><span>A picture</span><span ${containerAttribute('child')} ${keyAttribute('one')}>Not a picture</span><span ${blackboxAttribute('hidden')}>This should not appear.</span></div>`);

        fixture = document.createElement('div');
        fixture.classList.add(initial.type);
        fixture.setAttribute(CONTAINER_ATTRIBUTE, 'parent');

        span = document.createElement('span');
        span.textContent = 'A picture';
        fixture.appendChild(span);

        child = document.createElement('span');
        child.setAttribute(CONTAINER_ATTRIBUTE, 'child');
        child.setAttribute(KEY_ATTRIBUTE, 'one');
        child.textContent = 'Picture description';
        fixture.appendChild(child);

        blackboxed = document.createElement('span');
        blackboxed.setAttribute(BLACKBOX_ATTRIBUTE, 'hidden');
        blackboxed.textContent = 'This should stay.';
        fixture.appendChild(blackboxed);

        generator = render(template);
    });

    it('should throw without function', function() {
        const invalid = [{}, 'string', 2, true, []];

        invalid.forEach(template => {
            expect(() => render(template)).to.throw(AssertionError);
        });
    });

    it('should update element with new state', done => {
        const render$ = generator(fixture, props$);

        const sub = render$.observe({});
        props$.plug(constant(next));

        requestAnimationFrame(() => {
            expect(template).to.have.callCount(1);
            expect(template).to.have.been.calledWithExactly(next);

            expect(fixture).to.not.have.class(initial.type);
            expect(fixture).to.have.class(next.type);
            expect(span).to.not.have.text(initial.text);
            expect(span).to.have.text(next.text);

            sub.unsubscribe();

            done();
        });
    });

    it('should update child container element', done => {
        const render$ = generator(fixture, props$);

        const sub = render$.observe({});
        props$.plug(constant(next));

        requestAnimationFrame(() => {
            expect(template).to.have.callCount(1);
            expect(template).to.have.been.calledWithExactly(next);

            expect(child).to.have.text('Not a picture');

            sub.unsubscribe();

            done();
        });
    });

    it('should remove extra child container element', done => {
        let child2 = document.createElement('span');
        child2.setAttribute(CONTAINER_ATTRIBUTE, 'child');
        child2.setAttribute(KEY_ATTRIBUTE, 'two');
        child2.textContent = 'Another picture description';
        fixture.appendChild(child2);

        const render$ = generator(fixture, props$);

        const sub = render$.observe({});
        props$.plug(constant(next));

        requestAnimationFrame(() => {
            expect(template).to.have.callCount(1);
            expect(template).to.have.been.calledWithExactly(next);

            expect(fixture.children).to.have.lengthOf(3);
            expect(child.parentNode).to.eql(fixture);
            expect(child2.parentNode).to.eql(null);

            sub.unsubscribe();

            done();
        });
    });

    it('should add missing child container element', done => {
        fixture.removeChild(child);
        const render$ = generator(fixture, props$);

        const sub = render$.observe({});
        props$.plug(constant(next));

        requestAnimationFrame(() => {
            expect(template).to.have.callCount(1);
            expect(template).to.have.been.calledWithExactly(next);

            expect(fixture.children).to.have.lengthOf(3);

            sub.unsubscribe();

            done();
        });
    });

    it('should not update blackboxed element', done => {
        const render$ = generator(fixture, props$);

        const sub = render$.observe({});
        props$.plug(constant(next));

        requestAnimationFrame(() => {
            setTimeout(() => {
                expect(template).to.have.callCount(1);
                expect(template).to.have.been.calledWithExactly(next);

                expect(blackboxed.parentNode).to.eql(fixture);
                expect(blackboxed).to.have.text('This should stay.');

                sub.unsubscribe();

                done();
            }, 500);
        });
    });

    it('should remove extra blackboxed element', done => {
        let blackboxed2 = document.createElement('span');
        blackboxed2.setAttribute(BLACKBOX_ATTRIBUTE, 'removed');
        blackboxed2.textContent = 'Another blackboxed element.';
        fixture.appendChild(blackboxed2);

        const render$ = generator(fixture, props$);

        const sub = render$.observe({});
        props$.plug(constant(next));

        requestAnimationFrame(() => {
            expect(template).to.have.callCount(1);
            expect(template).to.have.been.calledWithExactly(next);

            expect(fixture.children).to.have.lengthOf(3);
            expect(child.parentNode).to.eql(fixture);
            expect(blackboxed2.parentNode).to.eql(null);

            sub.unsubscribe();

            done();
        });
    });

    it('should add missing blackboxed element', done => {
        fixture.removeChild(blackboxed);
        const render$ = generator(fixture, props$);

        const sub = render$.observe({});
        props$.plug(constant(next));

        requestAnimationFrame(() => {
            expect(template).to.have.callCount(1);
            expect(template).to.have.been.calledWithExactly(next);

            expect(fixture.children).to.have.lengthOf(3);
            expect(fixture.children[2]).to.have.text('This should not appear.');

            sub.unsubscribe();

            done();
        });
    });
});
