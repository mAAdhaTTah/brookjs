import { constant, Observable, pool } from 'kefir';

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import simulant from 'simulant';

import { delegateElement, CONTAINER_ATTRIBUTE, EVENT_ATTRIBUTES } from '../events';

chai.use(sinonChai);

describe('events$', function() {
    let callback, strm$, el, config, events$, value, sub;

    beforeEach(function() {
        callback = sinon.spy(evt$ => {
            strm$ = pool();
            strm$.plug(evt$);
            return strm$;
        });
        config = { callback };

        el = document.createElement('div');
        el.setAttribute(CONTAINER_ATTRIBUTE, 'fixture');

        events$ = delegateElement(config, el);

        value = sinon.spy();
        sub = events$.observe({ value });

        document.body.appendChild(el);
    });

    it('should return an Observable', function() {
        expect(events$).to.be.instanceof(Observable);
    });

    it('should have modified Observable', function() {
        expect(events$.callback).to.equal(strm$)
    });

    it('should pass the event Observable', function() {
        expect(callback.args[0][0]).to.be.instanceof(Observable);
    });

    it('should emit events into merged stream', function() {
        let event = new Event('fake');
        strm$.plug(constant(event));

        expect(value).to.be.calledWith(event);
    });

    it('should emit a click event', function() {
        el.setAttribute(EVENT_ATTRIBUTES['click'], Object.keys(config).pop());

        const event = simulant.fire(el, 'click');

        expect(value).to.be.calledOnce;
        expect(value).to.be.calledWith(event);
    });

    it('should emit a focus event', function() {
        const input = document.createElement('input');
        input.setAttribute(EVENT_ATTRIBUTES['focus'], Object.keys(config).pop());
        el.appendChild(input);

        const event = simulant.fire(input, 'focus');

        expect(value).to.be.calledOnce;
        expect(value).to.be.calledWith(event);
    });

    afterEach(function() {
        sub.unsubscribe();
        document.body.removeChild(el);
    })
});
