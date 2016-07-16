import { pool, stream } from 'kefir';
import { always, identity, pipe, prop } from 'ramda';
import { delegateElement } from './delegator';

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

const prefix = name => `data-brk-${name}`;

export const CONTAINER_ATTRIBUTE = 'data-brk-container';

export const EVENT_ATTRIBUTES = {
    click: prefix('onclick'),
    focus: prefix('onfocus')
};

/**
 * Data attribute for element events.
 *
 * @type {string}
 * @deprecated
 */
const DEPRECATED_EVENT_ATTRIBUTE = 'data-brk-event';

/**
 * Legacy events stream factory function.
 *
 * @param {Object} config - Events configuration object.
 * @param {Array} elements - Array of elements to emit from.
 * @returns {Kefir.Observable} Event stream.
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
 * @param {Element} el - Element to make a stream.
 * @returns {stream} Events stream instance.
 * @factory
 */
export default function events(config, el) {
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
        console.log('deprecated: element should use container attribute & hbs helpers');
        events$.plug(legacy(config, elements));
    }
    // end deprecated

    return events$;
};
