/* eslint-env mocha */
import Kefir from '../../kefir';
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
            strm$ = Kefir.pool();
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
        expect(events$).to.be.instanceof(Kefir.Observable);
    });

    it('should have modified Observable', function() {
        expect(events$.callback).to.equal(strm$);
    });

    it('should pass the event Observable', function() {
        expect(callback.args[0][0]).to.be.instanceof(Kefir.Observable);
    });

    it('should emit events into merged stream', function() {
        const event = simulant('click');
        strm$.plug(Kefir.constant(event));

        expect(value).to.have.callCount(1);
        expect(value).to.be.calledWith(event);
    });

    // Source: https://stackoverflow.com/questions/2877393/detecting-support-for-a-given-javascript-event
    const isEventSupported = (function() {
        const TAGNAMES = {
            'select': 'input','change': 'input',
            'submit': 'form','reset': 'form',
            'error': 'img','load': 'img','abort': 'img'
        };
        const IE_SIMULANT_FAILURES = ['paste', 'load', 'cut'];
        function isEventSupported(eventName) {
            if (simulant.mode === 'legacy' && IE_SIMULANT_FAILURES.includes(eventName)) {
                return false;
            }
            let el = document.createElement(TAGNAMES[eventName] || 'div');
            eventName = 'on' + eventName;
            let isSupported = (eventName in el);
            if (!isSupported) {
                el.setAttribute(eventName, 'return;');
                isSupported = typeof el[eventName] === 'function';
            }
            el = null;
            return isSupported;
        }
        return isEventSupported;
    })();

    SUPPORTED_EVENTS.forEach(event => {
        if (!isEventSupported(event)) {
            it.skip(`should emit ${event} event`);
        } else {
            it(`should emit ${event} event`, function() {
                value = sinon.spy();
                sub = events$.observe({ value });

                const target = document.createElement('input');
                target.setAttribute(EVENT_ATTRIBUTES[event], Object.keys(config).pop());
                el.appendChild(target);

                simulant.fire(target, event);

                expect(value).to.have.callCount(1);
                const e = value.getCall(0).args[0];

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
            const target = document.createElement('input');
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
