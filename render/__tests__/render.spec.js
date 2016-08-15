/* eslint-env mocha */
import { AssertionError } from 'assert';
import chai, { expect } from 'chai';
import dom from 'chai-dom';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import render from '../';

chai.use(sinonChai);
chai.use(dom);

describe('render', function() {
    const initial = {
        type: 'text',
        text: 'Hello world!'
    };
    let template, next, fixture, generator;

    beforeEach(function() {
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

    it('should update element with new state', function(done) {
        let render$ = generator(fixture, initial, next);

        render$.observe({ end: () => {
            expect(template).to.have.callCount(1);
            expect(template).to.have.been.calledWithExactly(next);

            expect(fixture).to.not.have.class(initial.type);
            expect(fixture).to.have.class(next.type);
            expect(fixture).to.not.have.text(initial.text);
            expect(fixture).to.have.text(next.text);

            done();
        } });
    });
});
