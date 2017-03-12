/* eslint-env mocha */
import { AssertionError } from 'assert';
import chai, { expect } from 'chai';
import dom from 'chai-dom';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { CONTAINER_ATTRIBUTE } from '../../constants';
import { containerAttribute } from '../../helpers';
import render from '../';

import { constant, pool } from 'kefir';

chai.use(sinonChai);
chai.use(dom);

describe('render', function() {
    const initial = {
        type: 'text',
        text: 'Hello world!'
    };
    let template, next, fixture, generator, props$, child, span;

    beforeEach(function() {
        props$ = pool();
        next = {
            type: 'image',
            text: 'A picture'
        };
        template = sinon.spy(() =>
`<div ${containerAttribute('parent')} class="image">
    <span>A picture</span>
    <span ${containerAttribute('child')}>Not a picture.</span>
</div>`);

        fixture = document.createElement('div');
        fixture.classList.add(initial.type);
        fixture.setAttribute(CONTAINER_ATTRIBUTE, 'parent');

        span = document.createElement('span');
        span.textContent = 'A picture';
        fixture.appendChild(span);

        child = document.createElement('span');
        child.setAttribute(CONTAINER_ATTRIBUTE, 'child');
        child.textContent = 'Picture description';
        fixture.appendChild(child);

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

    it('should not update child container element', done => {
        const render$ = generator(fixture, props$);

        const sub = render$.observe({});
        props$.plug(constant(next));

        requestAnimationFrame(() => {
            expect(template).to.have.callCount(1);
            expect(template).to.have.been.calledWithExactly(next);

            expect(child).to.have.text('Picture description');

            sub.unsubscribe();

            done();
        });
    });
});
