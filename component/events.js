import { stream } from 'kefir';
import { curry, pipe, prop } from 'ramda';

/**
 * Data attribute for element events.
 *
 * @type {string}
 */
const EVENT_ATTRIBUTE = 'data-brk-event';

/**
 * Create a new Events stream from the element.
 *
 * @param {Object} config - Events configuration.
 * @param {Element} el - Element to make a stream.
 * @returns {stream} Events stream instance.
 * @factory
 */
const Events = function Events(config, el) {
    return stream(emitter => {
        const elements = [];

        if (el.hasAttribute(EVENT_ATTRIBUTE)) {
            elements.push(el);
        }

        const handlers = elements.concat(
            // @todo problem here!
            // we can't guarantee that the nodes we get here are
            // from the component or its children.
            Array.from(el.querySelectorAll(`[${EVENT_ATTRIBUTE}]`))
        )
            .map(element => element.getAttribute(EVENT_ATTRIBUTE).split(';')
                .map(event => {
                    const [type, key] = event.split(':');
                    const listener = pipe(config[key], emitter.emit);

                    element.addEventListener(type, listener);

                    return { element, listener, type };
                })
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
};

export default curry(Events);

/**
 * Value change constant.
 *
 * @type {string}
 */
export const VALUE_CHANGE = 'VALUE_CHANGE';

/**
 * Create a new Value Change action.
 *
 * @param {string} value - Target value.
 * @returns {Object} Value Change action object.
 */
export function valueEventAction(value) {
    return {
        type: VALUE_CHANGE,
        payload: { value }
    };
}

/**
 * Adapter for value change events.
 *
 * @type {Function}
 */
export const valueEvent = pipe(prop('target'), prop('value'), valueEventAction);

/**
 * Checked change constant.
 *
 * @type {string}
 */
export const CHECKED_CHANGE = 'CHECKED_CHANGE';

/**
 * Create a new Checked Change action.
 *
 * @param {boolean} checked - Target checked.
 * @returns {Object} Checked Change action object.
 */
export function checkedEventAction(checked) {
    return {
        type: CHECKED_CHANGE,
        payload: { checked }
    };
}

/**
 * Adapter for checked change events.
 *
 * @type {Function}
 */
export const checkedEvent = pipe(prop('target'), prop('checked'), checkedEventAction);
