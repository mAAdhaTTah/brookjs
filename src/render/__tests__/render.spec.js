/* eslint-env mocha */
import { AssertionError } from 'assert';
import chai, { expect } from 'chai';
import dom from 'chai-dom';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import hbs from 'handlebars/runtime';

import { source } from './fixtures';

import { BLACKBOX_ATTRIBUTE, CONTAINER_ATTRIBUTE, KEY_ATTRIBUTE } from '../../constants';
import { blackboxAttribute, containerAttribute, keyAttribute } from '../../helpers';
import render from '../';

import Kefir from 'kefir';

chai.use(sinonChai);
chai.use(dom);

hbs.registerHelper('blackbox', attr => new hbs.SafeString(blackboxAttribute(attr)));
hbs.registerHelper('container', attr => new hbs.SafeString(containerAttribute(attr)));
hbs.registerHelper('key', attr => new hbs.SafeString(keyAttribute(attr)));

describe('render', function() {
    const initial = {
        type: 'text',
        text: 'Hello world!'
    };
    const next = {
        type: 'image',
        text: 'A picture'
    };
    let template, fixture, generator, child, span, blackboxed;

    beforeEach(function() {
        template = sinon.spy(() => source());

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
        generator(fixture, Kefir.constant(next)).observe({
            end() {
                expect(template).to.have.callCount(1);
                expect(template).to.have.been.calledWithExactly(next);

                expect(fixture).to.not.have.class(initial.type);
                expect(fixture).to.have.class(next.type);
                expect(span).to.not.have.text(initial.text);
                expect(span).to.have.text(next.text);

                done();
            }
        });
    });

    it('should update child container element', done => {
        generator(fixture, Kefir.constant(next)).observe({
            end() {
                expect(template).to.have.callCount(1);
                expect(template).to.have.been.calledWithExactly(next);

                expect(child).to.have.text('Not a picture');

                done();
            }
        });
    });

    it('should remove extra child container element', done => {
        let child2 = document.createElement('span');
        child2.setAttribute(CONTAINER_ATTRIBUTE, 'child');
        child2.setAttribute(KEY_ATTRIBUTE, 'two');
        child2.textContent = 'Another picture description';
        fixture.appendChild(child2);

        generator(fixture, Kefir.constant(next)).observe({
            end() {
                expect(template).to.have.callCount(1);
                expect(template).to.have.been.calledWithExactly(next);

                expect(fixture.children).to.have.lengthOf(3);
                expect(child.parentNode).to.eql(fixture);
                expect(child2.parentNode).to.eql(null);

                done();
            }
        });
    });

    it('should add missing child container element', done => {
        fixture.removeChild(child);

        generator(fixture, Kefir.constant(next)).observe({
            end() {
                expect(template).to.have.callCount(1);
                expect(template).to.have.been.calledWithExactly(next);

                expect(fixture.children).to.have.lengthOf(3);

                done();
            }
        });
    });

    it('should not update blackboxed element', done => {
        const render$ = generator(fixture, Kefir.constant(next));

        render$.observe({
            end() {
                expect(template).to.have.callCount(1);
                expect(template).to.have.been.calledWithExactly(next);

                expect(blackboxed.parentNode).to.eql(fixture);
                expect(blackboxed).to.have.text('This should stay.');

                done();
            }
        });
    });

    it('should remove extra blackboxed element', done => {
        let blackboxed2 = document.createElement('span');
        blackboxed2.setAttribute(BLACKBOX_ATTRIBUTE, 'removed');
        blackboxed2.textContent = 'Another blackboxed element.';
        fixture.appendChild(blackboxed2);

        generator(fixture, Kefir.constant(next)).observe({
            end() {
                expect(template).to.have.callCount(1);
                expect(template).to.have.been.calledWithExactly(next);

                expect(fixture.children).to.have.lengthOf(3);
                expect(child.parentNode).to.eql(fixture);
                expect(blackboxed2.parentNode).to.eql(null);

                done();
            }
        });
    });

    it('should add missing blackboxed element', done => {
        fixture.removeChild(blackboxed);

        generator(fixture, Kefir.constant(next)).observe({
            end() {
                expect(template).to.have.callCount(1);
                expect(template).to.have.been.calledWithExactly(next);

                expect(fixture.children).to.have.lengthOf(3);
                expect(fixture.children[2]).to.have.text('This should not appear.');

                done();
            }
        });
    });
});
