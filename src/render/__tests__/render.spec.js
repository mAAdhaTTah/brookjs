/* eslint-env mocha */
import { AssertionError } from 'assert';
import chai, { expect } from 'chai';
import dom from 'chai-dom';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import hbs from 'handlebars/runtime';

import * as Desalinate from '../../desalinate';
import { attachDetachReplace, attributeText, hideBlackboxed, simpleUpdate,
    updateChild, rootBlackboxed } from './fixtures';

import { animateAttribute, blackboxAttribute, containerAttribute, keyAttribute } from '../../helpers';
import render from '../';

import Kefir from '../../kefir';

chai.use(sinonChai);
chai.use(dom);

hbs.registerHelper('animate', attr => new hbs.SafeString(animateAttribute(attr)));
hbs.registerHelper('blackbox', attr => new hbs.SafeString(blackboxAttribute(attr)));
hbs.registerHelper('container', attr => new hbs.SafeString(containerAttribute(attr)));
hbs.registerHelper('key', attr => new hbs.SafeString(keyAttribute(attr)));

describe('render', function() {
    it('should throw without function', function() {
        const invalid = [{}, 'string', 2, true, []];

        invalid.forEach(template => {
            expect(() => render(template)).to.throw(AssertionError);
        });
    });

    it('should update element with new state', done => {
        const initial = {
            type: 'text',
            text: 'Hello world!'
        };
        const next = {
            type: 'image',
            text: 'A picture'
        };
        const el = Desalinate.createElementFromTemplate(simpleUpdate, initial);
        const template = sinon.spy(simpleUpdate);
        const renderFactory = render(template);

        renderFactory(el, Kefir.constant(next)).observe({
            end() {
                expect(template).to.have.callCount(1);
                expect(template).to.have.been.calledWithExactly(next);

                expect(el).to.not.have.class(initial.type);
                expect(el).to.have.class(next.type);
                expect(el).to.not.have.text(initial.text);
                expect(el).to.have.text(next.text);

                done();
            }
        });
    });

    it('should update child container element', done => {
        const initial = {
            headline: 'Children',
            children: [{ text: 'Child 1 Text', id: '1' }]
        };
        const next = {
            headline: 'Children',
            children: [{ text: 'Child 1 New Text', id: '1' }]
        };
        const el = Desalinate.createElementFromTemplate(updateChild, initial);
        const [child] = el.querySelectorAll('[data-brk-container="child"]');
        const template = sinon.spy(updateChild);
        const renderFactory = render(template);

        renderFactory(el, Kefir.constant(next)).observe({
            end() {
                expect(template).to.have.callCount(1);
                expect(template).to.have.been.calledWithExactly(next);

                expect(child).to.have.text(next.children[0].text);
                expect(child.parentNode).to.eql(el);

                done();
            }
        });
    });

    it('should remove extra child container element', done => {
        const initial = {
            headline: 'Children',
            children: [{ text: 'Child 1 Text', id: '1' }, { text: 'Child 2 Text', id: '2' }]
        };
        const next = {
            headline: 'Children',
            children: [{ text: 'Child 1 Text', id: '1' }]
        };
        const el = Desalinate.createElementFromTemplate(updateChild, initial);
        const [child1, child2] = el.querySelectorAll('[data-brk-container="child"]');
        const template = sinon.spy(updateChild);
        const renderFactory = render(template);

        renderFactory(el, Kefir.constant(next)).observe({
            end() {
                expect(template).to.have.callCount(1);
                expect(template).to.have.been.calledWithExactly(next);

                expect(el.children).to.have.lengthOf(2); // 2 -> Headline & child
                expect(child1.parentNode).to.eql(el);
                expect(child2.parentNode).to.eql(null);

                done();
            }
        });
    });

    it('should remove and modify children with matching keys', done => {
        const initial = {
            headline: 'Children',
            children: [{ text: 'Child 1 Text', id: '1' }, { text: 'Child 2 Text', id: '2' }]
        };
        const next = {
            headline: 'Children',
            children: [{ text: 'Child 2 New Text', id: '2' }]
        };
        const el = Desalinate.createElementFromTemplate(updateChild, initial);
        const [child1, child2] = el.querySelectorAll('[data-brk-container="child"]');
        const template = sinon.spy(updateChild);
        const renderFactory = render(template);

        renderFactory(el, Kefir.constant(next)).observe({
            end() {
                expect(template).to.have.callCount(1);
                expect(template).to.have.been.calledWithExactly(next);

                expect(el.children).to.have.lengthOf(2); // 2 -> Headline & child
                expect(child1.parentNode).to.eql(null);
                expect(child2.parentNode).to.eql(el);

                expect(child2).to.have.text(next.children[0].text);

                done();
            }
        });
    });

    it('should add missing child container element', done => {
        const initial = {
            headline: 'Children',
            children: [{ text: 'Child 1 Text', id: '1' }]
        };
        const next = {
            headline: 'Children',
            children: [{ text: 'Child 1 Text', id: '1' }, { text: 'Child 2 Text', id: '2' }]
        };
        const el = Desalinate.createElementFromTemplate(updateChild, initial);
        const template = sinon.spy(updateChild);
        const renderFactory = render(template);

        renderFactory(el, Kefir.constant(next)).observe({
            end() {
                expect(template).to.have.callCount(1);
                expect(template).to.have.been.calledWithExactly(next);

                expect(el.children).to.have.lengthOf(3); // 3 -> Headline & 2 children

                const [child1, child2] = el.querySelectorAll('[data-brk-container="child"]');

                expect(child1).to.have.text(next.children[0].text);
                expect(child2).to.have.text(next.children[1].text);

                done();
            }
        });
    });

    it('should not update blackboxed element', done => {
        const initial = {
            headline: 'Blackboxed',
            blackboxed: [{ text: 'Blackboxed 1 Text', id: '1' }]
        };
        const next = {
            headline: 'Blackboxed',
            blackboxed: [{ text: 'Blackboxed 1 New Text', id: '1' }]
        };
        const el = Desalinate.createElementFromTemplate(hideBlackboxed, initial);
        const template = sinon.spy(hideBlackboxed);
        const renderFactory = render(template);

        renderFactory(el, Kefir.constant(next)).observe({
            end() {
                expect(template).to.have.callCount(1);
                expect(template).to.have.been.calledWithExactly(next);

                const blackboxed = el.querySelector('[data-brk-blackbox="1"]');

                expect(blackboxed.parentNode).to.eql(el);
                expect(blackboxed).to.have.text(initial.blackboxed[0].text);

                done();
            }
        });
    });

    it('should not update blackboxed element if modified between renders', done => {
        const initial = {
            headline: 'Blackboxed',
            blackboxed: [{ text: 'Blackboxed 1 Text', id: '1' }]
        };
        const next = {
            headline: 'Blackboxed',
            blackboxed: [{ text: 'Blackboxed 1 New Text', id: '1' }]
        };
        const final = {
            headline: 'Blackboxed',
            blackboxed: [{ text: 'Blackboxed 1 Final Text', id: '1' }]
        };
        const modifiedTextContent = 'Blackboxed 1 Modified Text';
        const el = Desalinate.createElementFromTemplate(hideBlackboxed, initial);
        const template = sinon.spy(hideBlackboxed);
        const renderFactory = render(template);
        const modify$ = Kefir.stream(emitter => {
            const blackboxed = el.querySelector('[data-brk-blackbox="1"]');

            blackboxed.textContent = modifiedTextContent;

            emitter.end();
        });

        renderFactory(el, Kefir.concat([Kefir.constant(next), modify$, Kefir.constant(final)])).observe({
            end() {
                expect(template).to.have.callCount(2);
                expect(template).to.have.been.calledWithExactly(next);

                const blackboxed = el.querySelector('[data-brk-blackbox="1"]');

                expect(blackboxed.parentNode).to.eql(el);
                expect(blackboxed).to.have.text(modifiedTextContent);

                done();
            }
        });
    });

    it('should add missing blackboxed element', done => {
        const initial = {
            headline: 'Blackboxed',
            blackboxed: [{ text: 'Blackboxed 1 Text', id: '1' }]
        };
        const next = {
            headline: 'Blackboxed',
            blackboxed: [{ text: 'Blackboxed 1 New Text', id: '1' }, { text: 'Blackboxed 2 Text', id: '2' }]
        };
        const el = Desalinate.createElementFromTemplate(hideBlackboxed, initial);
        const template = sinon.spy(hideBlackboxed);
        const renderFactory = render(template);

        renderFactory(el, Kefir.constant(next)).observe({
            end() {
                expect(template).to.have.callCount(1);
                expect(template).to.have.been.calledWithExactly(next);

                const [one, two] = el.querySelectorAll('[data-brk-blackbox]');

                expect(one).to.have.text(initial.blackboxed[0].text);
                expect(two).to.have.text(next.blackboxed[1].text);

                done();
            }
        });
    });

    it('should remove extra blackboxed element', done => {
        const initial = {
            headline: 'Blackboxed',
            blackboxed: [{ text: 'Blackboxed 1 New Text', id: '1' }, { text: 'Blackboxed 2 Text', id: '2' }]
        };
        const next = {
            headline: 'Blackboxed',
            blackboxed: [{ text: 'Blackboxed 1 Text', id: '1' }]
        };
        const el = Desalinate.createElementFromTemplate(hideBlackboxed, initial);
        const template = sinon.spy(hideBlackboxed);
        const renderFactory = render(template);

        renderFactory(el, Kefir.constant(next)).observe({
            end() {
                expect(template).to.have.callCount(1);
                expect(template).to.have.been.calledWithExactly(next);

                const [one, two] = el.querySelectorAll('[data-brk-blackbox]');

                expect(one).to.have.text(initial.blackboxed[0].text);
                expect(two).to.equal(undefined);

                done();
            }
        });
    });

    it('should render root blackboxed element', done => {
        const initial = {
            text: 'Initial text'
        };
        const next = {
            text: 'Next text'
        };

        const el = Desalinate.createElementFromTemplate(rootBlackboxed, initial);

        const template = sinon.spy(rootBlackboxed);
        const renderFactory = render(template);

        renderFactory(el, Kefir.constant(next)).observe({
            end() {
                expect(template).to.have.callCount(1);
                expect(template).to.have.been.calledWithExactly(next);

                expect(el.textContent).to.equal(next.text);

                done();
            }
        });
    });

    it('should call callback when node added', done => {
        const initial = {
            children: []
        };
        const next = {
            children: [{ text: 'First' }]
        };
        const container = Desalinate.createElementFromTemplate(attachDetachReplace, initial);
        const template = sinon.spy(attachDetachReplace);
        const attached = sinon.stub().onFirstCall().returnsArg(0);
        const renderFactory = render(template, {
            animated: { attached }
        });

        renderFactory(container, Kefir.constant(next)).observe({
            end() {
                const target = container.querySelector(`[${animateAttribute('animated')}]`);
                const parent = target.parentNode;

                expect(attached).to.have.callCount(1)
                    .and.have.been.calledWithMatch(
                        sinon.match.instanceOf(Kefir.Observable),
                        sinon.match({ container, parent, target })
                    );

                done();
            }
        });
    });

    it('should call callback when node removed', done => {
        const initial = {
            children: [{ text: 'First' }]
        };
        const next = {
            children: []
        };
        const container = Desalinate.createElementFromTemplate(attachDetachReplace, initial);
        const template = sinon.spy(attachDetachReplace);
        const detached = sinon.stub().onFirstCall().returnsArg(0);
        const renderFactory = render(template, {
            animated: { detached }
        });

        const target = container.querySelector(`[${animateAttribute('animated')}]`);
        const parent = target.parentNode;

        renderFactory(container, Kefir.constant(next)).observe({
            end() {
                expect(detached).to.have.callCount(1)
                    .and.have.been.calledWithMatch(
                        sinon.match.instanceOf(Kefir.Observable),
                        sinon.match({ container, parent, target })
                    );

                done();
            }
        });
    });

    it('should call callback when nodes replaced', done => {
        const initial = {
            children: [{ text: 'First', id: 1 }]
        };
        const next = {
            children: [{ text: 'Second', id: 2 }]
        };
        const container = Desalinate.createElementFromTemplate(attachDetachReplace, initial);
        const template = sinon.spy(attachDetachReplace);
        const replaced = sinon.stub().onFirstCall().returnsArg(0);
        const renderFactory = render(template, {
            animated: { replaced }
        });

        const outgoing = container.querySelector(`[${animateAttribute('animated')}]`);
        const parent = outgoing.parentNode;

        renderFactory(container, Kefir.constant(next)).observe({
            end() {
                const incoming = container.querySelector(`[${animateAttribute('animated')}]`);

                expect(replaced).to.have.callCount(1)
                    .and.have.been.calledWithMatch(
                        sinon.match.instanceOf(Kefir.Observable),
                        sinon.match({ container, parent, incoming, outgoing })
                    );

                done();
            }
        });
    });

    it('should call callback when attribute changed', done => {
        const initial = {
            attribute: 'firstattr',
            text: 'First Text'
        };
        const next = {
            attribute: 'secondattr',
            text: 'First Text'
        };
        const el = Desalinate.createElementFromTemplate(attributeText, initial);
        const template = sinon.spy(attributeText);
        const attributechanged = sinon.stub().onFirstCall().returnsArg(0);
        const renderFactory = render(template, {
            animated: { attributechanged }
        });

        renderFactory(el, Kefir.constant(next)).observe({
            end() {
                expect(attributechanged).to.have.callCount(1);

                done();
            }
        });
    });

    it('should call callback when attribute added', done => {
        const initial = {
            text: 'First Text'
        };
        const next = {
            attribute: 'firstattr',
            text: 'First Text'
        };
        const el = Desalinate.createElementFromTemplate(attributeText, initial);
        const template = sinon.spy(attributeText);
        const attributechanged = sinon.stub().onFirstCall().returnsArg(0);
        const renderFactory = render(template, {
            animated: { attributechanged }
        });

        renderFactory(el, Kefir.constant(next)).observe({
            end() {
                expect(attributechanged).to.have.callCount(1);

                done();
            }
        });
    });

    it('should call callback when attribute removed', done => {
        const initial = {
            attribute: 'firstattr',
            text: 'First Text'
        };
        const next = {
            text: 'First Text'
        };
        const el = Desalinate.createElementFromTemplate(attributeText, initial);
        const template = sinon.spy(attributeText);
        const attributechanged = sinon.stub().onFirstCall().returnsArg(0);
        const renderFactory = render(template, {
            animated: { attributechanged }
        });

        renderFactory(el, Kefir.constant(next)).observe({
            end() {
                expect(attributechanged).to.have.callCount(1);

                done();
            }
        });
    });

    it('should call callback when text changed', done => {
        const initial = {
            attribute: 'firstattr',
            text: 'First Text'
        };
        const next = {
            attribute: 'firstattr',
            text: 'Second Text'
        };
        const el = Desalinate.createElementFromTemplate(attributeText, initial);
        const template = sinon.spy(attributeText);
        const textchanged = sinon.stub().onFirstCall().returnsArg(0);
        const renderFactory = render(template, {
            animated: { textchanged }
        });

        renderFactory(el, Kefir.constant(next)).observe({
            end() {
                expect(textchanged).to.have.callCount(1);

                done();
            }
        });
    });

    afterEach(() => {
        Desalinate.cleanup();
    });
});
