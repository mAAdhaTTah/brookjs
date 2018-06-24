import assert from 'assert';
import R from 'ramda';
import Kefir from '../../kefir';
import { CAPTURE, CONTAINER_ATTRIBUTE, EVENT_ATTRIBUTES, SUPPORTED_EVENTS } from '../constants';
import * as Event from './event';

/**
 * Associates a DOM element with its dispatch function.
 *
 * @type {WeakMap}
 */
const sources = new WeakMap();

/**
 * Check if any element in the capture area
 * and call the dispatcher with the event key.
 *
 * @param {string} EVENT - Event name.
 * @param {Emitter} emitter - source$ emitter.
 * @param {Event} ev - Event object.
 */
const listener = R.curry(function listener(EVENT, emitter, event) {
    (function traverse(target) {
        // Base case.
        if (!target || target === document.body) {
            return;
        }

        if (target.hasAttribute(EVENT_ATTRIBUTES[EVENT])) {
            let container = target;
            const callback = target.getAttribute(EVENT_ATTRIBUTES[EVENT]);

            while (container !== document.body && !container.hasAttribute(CONTAINER_ATTRIBUTE)) {
                container = container.parentNode;
            }

            if (container.hasAttribute(CONTAINER_ATTRIBUTE)) {
                const ev = Event.create(event, target, container);
                emitter.value({ callback, container, ev });
            }
        }

        traverse(target.parentNode);
    })(event.target);
});


/**
 * Global events source stream.
 *
 * Delegates the subscription of any required events,
 * allowing many individual streams of DOM events to be
 * created out of a small number of event listeners.
 *
 * @type {Stream<T, S>}
 */
const sources$ = Kefir.stream(emitter => {
    const listeners = {};

    SUPPORTED_EVENTS.forEach(EVENT =>
        document.body.addEventListener(
            EVENT,
            listeners[EVENT] = listener(EVENT, emitter),
            CAPTURE[EVENT]));

    return () =>
        SUPPORTED_EVENTS.forEach(EVENT =>
            document.body.removeEventListener(
                EVENT,
                listeners[EVENT],
                CAPTURE[EVENT]));
});

/**
 * Retrieves the event object from the emitted object.
 */
const getEvent = R.prop('ev');

/**
 * Determines if the event object is scoped to the provided container & callback.
 *
 * @param {string} key - Container key.
 * @param {Element} el - Container element.
 * @param {Object} event - Event object.
 * @returns {boolean} Whether the event is matched.
 */
const eventMatches = R.curry(function eventMatches(key, el, event) {
    return event.callback === key && event.container === el;
});

/**
 * Create a new Events stream from the element.
 *
 * @param {Object} config - Events configuration.
 * @returns {Function} Events stream generator function.
 */
export default function events(config) {
    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('brookjs#component has been deprecated. Please migrate to brookjs-silt (React-based components).');

        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                assert.equal(typeof config[key], 'function', `events[${key}] is not a function`);
            }
        }
    }

    /**
     * Creates a delegated events$ stream from the element
     * and configuration.
     *
     * @param {Element} el - Element to make a stream.
     * @returns {Observable} Events stream instance.
     * @factory
     */
    return R.curry(el => {
        if (!el.hasAttribute(CONTAINER_ATTRIBUTE)) {
            return Kefir.never();
        }

        if (sources.has(el)) {
            return sources.get(el);
        }

        const mixin = {};

        const streams = Object.keys(config)
            .map(key =>
                mixin[key] = config[key](sources$
                    .filter(eventMatches(key, el))
                    .map(getEvent)));

        const events$ = Object.assign(Object.create(Kefir.merge(streams)), mixin);
        sources.set(el, events$);
        return events$;
    });
};
