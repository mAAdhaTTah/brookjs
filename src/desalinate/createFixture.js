import R from 'ramda';
import { constant, pool } from 'kefir';
import createElementFromTemplate from './createElementFromTemplate';

/**
 * Creates object of fixtures for testing.
 *
 * @param {Function} component - Component factory function.
 * @param {Function} template - Associated handlebars template function.
 * @param {Object} state - Initial state
 * @returns {{el, instance: Observable}} Fixtures.
 */
export default function createFixture(component, template, state) {
    const el = createElementFromTemplate(template, state);
    const state$ = pool();
    state$.plug(constant(R.clone(state)));

    const instance = component(el, state$.toProperty());

    return { el, instance, state$ };
}
