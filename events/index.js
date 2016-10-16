import assert from 'assert';
import R from 'ramda';
import { merge, stream, never } from 'kefir';
import { CONTAINER_ATTRIBUTE, EVENT_ATTRIBUTES } from '../constants';

/**
 * Associates a DOM element with its dispatch function.
 *
 * @type {WeakMap}
 */
const sources = new WeakMap();

/**
 * Supported event constants.
 *
 * @type {string}
 */
const CLICK = 'click';
const FOCUS = 'focus';
const INPUT = 'input';
const CHANGE = 'change';

export const SUPPORTED_EVENTS = [CLICK, FOCUS, INPUT, CHANGE];

/**
 * Whether the event listener should be captured.
 *
 * @type {Object}
 */
const CAPTURE = {
    [CLICK]: false,
    [FOCUS]: true,
    [INPUT]: true,
    [CHANGE]: true
};

/**
 * Check if any element in the capture area
 * and call the dispatcher with the event key.
 *
 * @param {string} EVENT - Event name.
 * @param {Emitter} emitter - source$ emitter.
 * @param {Event} ev - Event object.
 */
const listener = R.curry(function listener(EVENT, emitter, ev) {
    (function traverse(target) {
        // Base case.
        if (!target || target === document.body) {
            return;
        }

        if (target.hasAttribute(EVENT_ATTRIBUTES[EVENT])) {
            let container = target;
            let callback = target.getAttribute(EVENT_ATTRIBUTES[EVENT]);

            while (container !== document.body && !container.hasAttribute(CONTAINER_ATTRIBUTE)) {
                container = container.parentNode;
            }

            if (container.hasAttribute(CONTAINER_ATTRIBUTE)) {
                emitter.value({ callback, container, ev });
            }
        }

        traverse(target.parentNode);
    })(ev.target);
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
const sources$ = stream(emitter => {
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
    for (let key in config) {
        if (config.hasOwnProperty(key)) {
            assert.equal(typeof config[key], 'function', `events[${key}] is not a function`);
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
            return never();
        }

        if (sources.has(el)) {
            return sources.get(el);
        }

        let mixin = {};

        let streams = Object.keys(config)
            .map(key =>
                mixin[key] = config[key](sources$
                    .filter(eventMatches(key, el))
                    .map(getEvent)));

        let events$ = Object.assign(Object.create(merge(streams)), mixin);
        sources.set(el, events$);
        return events$;
    });
};
