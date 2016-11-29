/* eslint-env mocha */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { never, pool } from 'kefir';

import silt from '../';

chai.use(sinonChai);

describe('silt', () => {
    describe('template tag', () => {
        it('should return a function', () => {
            const Component = silt`<div></div>`;

            expect(Component).to.be.a('function');
        });

        it('should call onMount', () => {
            const spy = sinon.spy(() => never());
            const onMount = silt.onMount(spy);
            const Component = silt`<div ${onMount}></div>`;
            const fixture = document.createElement('div');
            const props$ = pool();

            const sub = Component(fixture, props$).observe({});

            expect(spy).to.have.callCount(1);
            expect(spy).to.have.been.calledWith(fixture, props$);

            sub.unsubscribe();
        });
    });
});
