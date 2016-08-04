import { curry } from 'ramda';

/**
 * Maps actions objects of the source type to the destination type.
 *
 * @param {string} source - Action type to change.
 * @param {string} dest - Action type to become.
 * @param {Object} action - Action object to change.
 * @param {string} action.type - Action type.
 * @param {Object} action.payload - Action payload.
 * @returns {Object} Updated Action object.
 */
export const mapActionTo = curry(function mapActionTo(source, dest, { type, payload }) {
    if (type === source) {
        type = dest;
        payload = Object.assign({}, payload, { source });
    }

    return { type, payload };
});

/**
 * Creates object of fixtures for testing.
 *
 * @param {Function} component - Component factory function.
 * @param {Function} template - Associated handlebars template function.
 * @param {Object} state - Initial state
 * @returns {{el, instance: *}} Fixtures.
 */
export function createFixture(component, template, state) {
    const el = (() => {
        let html = template(state);
        let result = document.createElement('div');
        result.innerHTML = html;

        return result.children[0];
    })();

    const instance = component(el, state);

    return { el, instance };
}

export default { mapActionTo, createFixture };
