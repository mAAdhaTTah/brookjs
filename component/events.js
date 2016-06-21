import { stream } from 'kefir';
import { always, curry, pipe, prop } from 'ramda';

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
                    const hook = config[key];
                    const listener = function listener(ev) {
                        const value = hook(ev);

                        if (value) {
                            emitter.emit(value);
                        }
                    };

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
 * @param {boolean} value - Target checked.
 * @returns {Object} Checked Change action object.
 */
export function checkedEventAction(value) {
    return {
        type: CHECKED_CHANGE,
        payload: { value }
    };
}

/**
 * Adapter for checked change events.
 *
 * @type {Function}
 */
export const checkedEvent = pipe(prop('target'), prop('checked'), checkedEventAction);

export const FIELD_FOCUS = 'FIELD_FOCUS';

/**
 * Create a FIELD_FOCUS action object.
 *
 * @returns {{type: string}} FIELD_FOCUS action.
 */
export const fieldFocusAction = function fieldFocusAction(name) {
    return {
        type: FIELD_FOCUS,
        payload: { name }
    };
};

export const focusEvent = pipe(prop('target'), prop('name'), fieldFocusAction);

export const CLICK = 'CLICK';

/**
 * Create a new Clicked action
 *
 * @returns {{type: string}} Clicked action object.
 */
export const clickedEventAction = function clickedEventAction() {
    return { type: CLICK };
};

export const clickEvent = always(clickedEventAction());
