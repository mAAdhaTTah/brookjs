import R from 'ramda';
import { merge, stream } from 'kefir';
import { CONTAINER_ATTRIBUTE, EVENT_ATTRIBUTES } from './index';

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

export const SUPPORTED_EVENTS = [CLICK, FOCUS];

/**
 * Whether the event listener should be captured.
 *
 * @type {Object}
 */
const CAPTURE = {
    [CLICK]: false,
    [FOCUS]: true
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
    let target = ev.target;

    while (target !== document.body) {
        if (target.hasAttribute(EVENT_ATTRIBUTES[EVENT])) {
            let container = target;
            let callback = target.getAttribute(EVENT_ATTRIBUTES[EVENT]);

            while (container !== document.body && !container.hasAttribute(CONTAINER_ATTRIBUTE)) {
                container = container.parentNode;
            }

            if (container.hasAttribute(CONTAINER_ATTRIBUTE)) {
                emitter.value({ callback, container, ev })
            }
        }

        target = target.parentNode;
    }
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

const eventMatches = R.curry(function eventMatches(key, el, event) {
    return R.converge(R.and, [
        R.propEq('callback', key),
        R.propEq('container', el)
    ], event);
});

/**
 * Creates a delegated events$ stream from the element
 * and configuration.
 *
 * @param {Object} config - Events configuration.
 * @param {HTMLElement} el - Element to make stream from.
 * @returns {Observable} Delegated events$ stream.
 */
export function delegateElement(config, el) {
    if (sources.has(el)) {
        return sources.get(el);
    }

    let mixin = {};

    let streams = Object.keys(config)
        .map(key => {
            const source$ = sources$
                .filter(eventMatches(key, el))
                .map(getEvent);

            return mixin[key] = config[key](source$);
        });

    let events$ = Object.assign(Object.create(merge(streams)), mixin);
    sources.set(el, events$);
    return events$;
}
