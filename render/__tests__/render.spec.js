/* eslint-env mocha */
import { AssertionError } from 'assert';
import chai, { expect } from 'chai';
import dom from 'chai-dom';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import render from '../';

import { constant, pool } from 'kefir';

chai.use(sinonChai);
chai.use(dom);

describe('render', function() {
    const initial = {
        type: 'text',
        text: 'Hello world!'
    };
    let template, next, fixture, generator, props$;

    beforeEach(function() {
        props$ = pool();
        next = {
            type: 'image',
            text: 'A picture'
        };
        template = sinon.spy(() => '<div class="image">A picture</div>');

        fixture = document.createElement('div');
        fixture.classList.add(initial.type);
        fixture.textContent = initial.text;

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

        render$.observe({});
        props$.plug(constant(next));

        requestAnimationFrame(() => {
            expect(template).to.have.callCount(1);
            expect(template).to.have.been.calledWithExactly(next);

            expect(fixture).to.not.have.class(initial.type);
            expect(fixture).to.have.class(next.type);
            expect(fixture).to.not.have.text(initial.text);
            expect(fixture).to.have.text(next.text);

            done();
        });
    });
});
