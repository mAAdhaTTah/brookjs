/* eslint-env mocha */
import { constant, Observable, pool } from 'kefir';
import { CONTAINER_ATTRIBUTE, EVENT_ATTRIBUTES,
    SUPPORTED_EVENTS } from '../../constants';

import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import simulant from 'simulant';

import events from '../';

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

        events$ = events(config)(el);

        value = sinon.spy();
        sub = events$.observe({ value });

        document.body.appendChild(el);
    });

    it('should return an Observable', function() {
        expect(events$).to.be.instanceof(Observable);
    });

    it('should have modified Observable', function() {
        expect(events$.callback).to.equal(strm$);
    });

    it('should pass the event Observable', function() {
        expect(callback.args[0][0]).to.be.instanceof(Observable);
    });

    it('should emit events into merged stream', function() {
        let event = new Event('fake');
        strm$.plug(constant(event));

        expect(value).to.have.callCount(1);
        expect(value).to.be.calledWith(event);
    });

    SUPPORTED_EVENTS.forEach(event => {
        let skip = false;

        switch (event) {
            case 'cut':
            case 'paste':
                if (!window.ClipboardEvent) {
                    skip = true;
                }
                break;
            case 'load':
            case 'touchstart':
            case 'touchend':
            case 'touchcancel':
                if (window.callPhantom) {
                    skip = true;
                }
                break;
        }

        if (skip) {
            it.skip(`should emit ${event} event`);
        } else {
            it(`should emit ${event} event`, function() {
                value = sinon.spy();
                sub = events$.observe({ value });

                let target = document.createElement('input');
                target.setAttribute(EVENT_ATTRIBUTES[event], Object.keys(config).pop());
                el.appendChild(target);

                simulant.fire(target, event);

                expect(value).to.have.callCount(1);
                let e = value.getCall(0).args[0];

                expect(e.containerTarget).to.equal(el);
                expect(e.decoratedTarget).to.equal(target);
                expect(e.defaultPrevented).to.eql(false);

                e.preventDefault();

                expect(e.defaultPrevented).to.eql(true);
            });
        }
    });

    it('should only emit events for the triggered element', function() {
        value = sinon.spy();
        sub = events$.observe({ value });

        let count = 0;
        while (count < 3) {
            let target = document.createElement('input');
            target.setAttribute(EVENT_ATTRIBUTES.input, Object.keys(config).pop());
            target.setAttribute(EVENT_ATTRIBUTES.focus, 'dummy');
            el.appendChild(target);
            count++;
        }

        simulant.fire(el.querySelector('input'), 'input');

        expect(value).to.have.callCount(1);
    });

    afterEach(function() {
        sub.unsubscribe();
        document.body.removeChild(el);
    });
});
