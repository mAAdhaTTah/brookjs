import { pool, stream } from 'kefir';
import { always, identity, pipe, prop } from 'ramda';
import { delegateElement } from './delegator';


export * from './delegator';

/**
 * Value change Action type.
 *
 * @type {string}
 */
export const VALUE_CHANGE = 'VALUE_CHANGE';

/**
 * Create a new Value Change action.
 *
 * @param {string} value - Target value.
 * @returns {Action} Value Change action object.
 */
export function valueEventAction(value) {
    return {
        type: VALUE_CHANGE,
        payload: { value }
    };
}

/**
 * Maps a value change event to a VALUE_CHANGE action.
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
 * @returns {Action} Checked Change action object.
 */
export function checkedEventAction(value) {
    return {
        type: CHECKED_CHANGE,
        payload: { value }
    };
}

/**
 * Maps checked change event to CHECKED action..
 *
 * @type {Function}
 */
export const checkedEvent = pipe(prop('target'), prop('checked'), checkedEventAction);

/**
 * Field focus event action type.
 *
 * @type {string}
 */
export const FIELD_FOCUS = 'FIELD_FOCUS';

/**
 * Create a FIELD_FOCUS action object.
 *
 * @returns {Action} FIELD_FOCUS action.
 */
export const fieldFocusAction = function fieldFocusAction(name) {
    return {
        type: FIELD_FOCUS,
        payload: { name }
    };
};

/**
 * Maps focus event to FIELD_FOCUS action.
 *
 * @type {Function}
 */
export const focusEvent = pipe(prop('target'), prop('name'), fieldFocusAction);

/**
 * Click event Action type.
 *
 * @type {string}
 */
export const CLICK = 'CLICK';

/**
 * Create a new Clicked Action
 *
 * @returns {Action} Clicked action object.
 */
export const clickedEventAction = function clickedEventAction() {
    return { type: CLICK };
};

/**
 * Map click event to click event Action.
 *
 * @type {Function}
 */
export const clickEvent = always(clickedEventAction());

/**
 * HTML attribute container directive.
 *
 * @type {string}
 */
export const CONTAINER_ATTRIBUTE = 'data-brk-container';

/**
 * Event attribute prefixer.
 *
 * @param {string} name
 * @returns {string} HTML attribute
 */
const prefix = name => `data-brk-${name}`;

/**
 * HTML attribute event directives.
 *
 * @type {Object}
 */
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
 * @param {Element} el - Element to make a stream.
 * @returns {Observable} Events stream instance.
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
        events$.plug(legacy(config, elements));
    }
    // end deprecated

    return events$;
};
