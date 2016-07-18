import { curry } from 'ramda';
import { constant, merge, pool } from 'kefir';
import { CONTAINER_ATTRIBUTE, EVENT_ATTRIBUTES } from './index';

/**
 * Associates a DOM element with its dispatch function.
 *
 * @type {WeakMap}
 */
const DISPATCHERS = new WeakMap();

/**
 * Supported event constants.
 *
 * @type {string}
 */
const CLICK = 'click';
const FOCUS = 'focus';

const SUPPORTED_EVENTS = [CLICK, FOCUS];

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
 * @param {Event} ev - Event object.
 */
const listener = curry(function listener(EVENT, ev) {
    let target = ev.target;

    while (target !== document.body) {
        if (target.hasAttribute(EVENT_ATTRIBUTES[EVENT])) {
            let parent = target;

            while (!parent.hasAttribute(CONTAINER_ATTRIBUTE)) {
                parent = parent.parentNode;
            }

            if (DISPATCHERS.has(parent)) {
                let dispatch = DISPATCHERS.get(parent);

                dispatch(target.getAttribute(EVENT_ATTRIBUTES[EVENT]), ev);
            }
        }

        target = target.parentNode;
    }
});

/**
 * Event listener functions.
 *
 * @type {Object}
 */
const LISTENERS = {
    [CLICK]: listener(CLICK),
    [FOCUS]: listener(FOCUS)
};

/**
 * Whether the given event has already been
 * delegated to the document.body.
 *
 * @type {Object}
 */
let delegated = false;

/**
 * Registers the global event listeners to the document.
 */
function registerListeners() {
    SUPPORTED_EVENTS.forEach(event =>
        document.body.addEventListener(event, LISTENERS[event], CAPTURE[event])
    );

    delegated = true;
}

/**
 * Creates a delegated events$ stream from the element
 * and configuration.
 *
 * @param {Object} config - Events configuration.
 * @param {HTMLElement} el - Element to make stream from.
 * @returns {Observable} Delegated events$ stream.
 */
export function delegateElement(config, el) {
    if (!delegated) {
        registerListeners();
    }

    if (DISPATCHERS.has(el)) {
        return DISPATCHERS.get(el).events$;
    }

    let dispatchable = {};
    let extendable = {};
    let streams = Object.keys(config)
        .map(key =>
            extendable[key] = config[key](dispatchable[key] = pool()));

    /**
     * Dispatches an event down the key$ stream.
     *
     * @param {string} key - Callback key.
     * @param {Event} event - Event object.
     */
    const dispatch = function dispatch(key, event) {
        const stream$ = dispatchable[key];

        if (stream$) {
            stream$.plug(constant(event));
        }
    };

    dispatch.events$ = Object.assign(Object.create(merge(streams)), extendable);
    DISPATCHERS.set(el, dispatch);
    return dispatch.events$;
}
