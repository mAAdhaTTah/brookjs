/* eslint-env mocha */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { constant, fromCallback, never } from 'kefir';

import domDelta from '../';

chai.use(sinonChai);

describe('domDelta', () => {
    it('should be a function', () => {
        expect(domDelta).to.be.a('function');
    });

    it('should return a delta function', () => {
        const delta = domDelta({});

        expect(delta).to.be.a('function');
        expect(delta).to.have.lengthOf(2);
    });

    it('should emit an error if incorrect el', done => {
        const actions$ = never();
        const state$ = never();
        const delta = domDelta({ el: false });

        const delta$ = delta(actions$, state$);

        let errored;

        delta$.observe({
            error(err) {
                errored = true;
                expect(err).to.be.instanceOf(TypeError);
            },
            end() {
                expect(errored).to.eql(true);
                done();
            }
        });
    });

    it('should emit an error if incorrect view', done => {
        const actions$ = never();
        const state$ = never();
        const delta = domDelta({ el: document.body, view: false });

        const delta$ = delta(actions$, state$);

        let errored;

        delta$.observe({
            error(err) {
                errored = true;
                expect(err).to.be.instanceOf(TypeError);
            },
            end() {
                expect(errored).to.eql(true);
                done();
            }
        });
    });

    it('should emit an error if incorrect selectProps', done => {
        const actions$ = never();
        const state$ = never();
        const delta = domDelta({ el: document.body, view: never, selectProps: false });

        const delta$ = delta(actions$, state$);

        let errored;

        delta$.observe({
            error(err) {
                errored = true;
                expect(err).to.be.instanceOf(TypeError);
            },
            end() {
                expect(errored).to.eql(true);
                done();
            }
        });
    });

    it('should emit an error if el returns incorrect value', done => {
        const actions$ = never();
        const state$ = never();
        const delta = domDelta({ el: () => false, view: never, selectProps: x => x });

        const delta$ = delta(actions$, state$);

        let errored;

        delta$.observe({
            error(err) {
                errored = true;
                expect(err).to.be.instanceOf(TypeError);
            },
            end() {
                expect(errored).to.eql(true);
                done();
            }
        });
    });

    it('should call provided functions with proper args', done => {
        const actions$ = never();
        const state$ = never();
        const props$ = never();
        const config = {
            el: sinon.spy(doc => fromCallback(cb => cb(doc.body))),
            view: sinon.spy(() => constant({ type: 'EVENT' })),
            selectProps: sinon.spy(() => props$)
        };
        const delta = domDelta(config);

        const delta$ = delta(actions$, state$);

        let emitted;

        delta$.observe({
            value(val) {
                emitted = true;

                expect(val).to.eql({ type: 'EVENT' });
            },
            end() {
                expect(emitted).to.eql(true);

                expect(config.el).to.have.callCount(1);

                expect(config.selectProps).to.have.callCount(1);
                expect(config.selectProps).to.have.been.calledWith(state$);

                expect(config.view).to.have.callCount(1);
                expect(config.view).to.have.been.calledWith(document.body, props$);

                done();
            }
        });
    });
});
