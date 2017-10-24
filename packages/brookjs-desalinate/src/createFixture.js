import R from 'ramda';
import { Kefir } from 'brookjs';
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
    const state$ = Kefir.pool();
    state$.plug(Kefir.constant(R.clone(state)));

    const instance = component(el, state$.toProperty());

    return { el, instance, state$ };
}
