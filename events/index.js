import assert from 'assert';
import R from 'ramda';
import { pool, stream } from 'kefir';
import { always, identity, pipe, prop } from 'ramda';
import { CONTAINER_ATTRIBUTE } from '../constants';
import { delegateElement } from './delegator';
import { valueEventAction, checkedEventAction,
    fieldFocusAction, clickedEventAction } from './actions';

export * from './actions';
export * from './delegator';

/**
 * Maps a value change event to a VALUE_CHANGE action.
 *
 * @type {Function}
 */
export const valueEvent = pipe(prop('target'), prop('value'), valueEventAction);

/**
 * Maps checked change event to CHECKED action..
 *
 * @type {Function}
 */
export const checkedEvent = pipe(prop('target'), prop('checked'), checkedEventAction);

/**
 * Maps focus event to FIELD_FOCUS action.
 *
 * @type {Function}
 */
export const focusEvent = pipe(prop('target'), prop('name'), fieldFocusAction);

/**
 * Map click event to click event Action.
 *
 * @type {Function}
 */
export const clickEvent = always(clickedEventAction());

/**
 * Data attribute for element events.
 *
 * @type {string}
 * @deprecated
 */
export const DEPRECATED_EVENT_ATTRIBUTE = 'data-brk-event';

/**
 * Legacy events stream factory function.
 *
 * @param {Object} config - Events configuration object.
 * @param {Array} elements - Array of elements to emit from.
 * @returns {Observable} Event stream.
 * @deprecated
 */
function legacy(config, elements) {
    return stream(emitter => {
        const handlers = elements
            .map(element => element.getAttribute(DEPRECATED_EVENT_ATTRIBUTE).split(';')
                .map(event => {
                    const [type, key] = event.split(':');
                    const hook = config[key];

                    // Don't include any events with unmatched hooks.
                    if (!hook) {
                        return false;
                    }

                    const listener = function listener(ev) {
                        const value = hook(ev);

                        if (value) {
                            emitter.value(value);
                        }
                    };

                    element.addEventListener(type, listener);

                    return { element, listener, type };
                })
                .filter(identity)
            )
            .reduce((acc, next) => acc.concat(next), []);

        /**
         * Dispose of the listeners.
         */
        return function dispose() {
            handlers.forEach(
                ({ element, listener, type }) =>
                    element.removeEventListener(type, listener)
            );
        };
    });
}

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
     * Generates a new stream of events for the provided element.
     *
     * @param {Element} el - Element to make a stream.
     * @returns {Observable} Events stream instance.
     * @factory
     */
    return R.curry(el => {
        let events$ = pool();

        if (el.hasAttribute(CONTAINER_ATTRIBUTE)) {
            events$.plug(delegateElement(config, el));
        }

        // start deprecated
        let elements = [];

        if (el.hasAttribute(DEPRECATED_EVENT_ATTRIBUTE)) {
            elements.push(el);
        }

        elements = elements.concat(
            // @todo problem here!
            // we can't guarantee that the nodes we get here are
            // from the component or its children.
            Array.from(el.querySelectorAll(`[${DEPRECATED_EVENT_ATTRIBUTE}]`) || [])
        );

        if (elements.length) {
            events$.plug(legacy(config, elements));
        }
        // end deprecated

        return events$;
    });
};
