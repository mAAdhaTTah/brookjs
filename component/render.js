import $$observable from 'symbol-observable';
import assert from 'assert';
import { CONTAINER_ATTRIBUTE } from './events';
import { curry } from 'ramda';
import { stream, never } from 'kefir';
import morphdom from 'morphdom';

/**
 * Generates a new rendering stream that
 * ends when the element is updated.
 *
 * @param {Object} config - Render configuration.
 * @param {Object} prev - Previous state.
 * @param {Object} next - Next state.
 * @returns {Stream<void, void>} Rendering stream.
 * @factory
 */
const renderGenerator = function renderGenerator({ api, template, render }, prev, next) {
    let render$ = never();

    if (template) {
        render$ = render$.concat(stream(emitter => {
            const loop = requestAnimationFrame(() => {
                morphdom(api.el, template(next), {
                    onBeforeElUpdated: function blackboxContainer(fromEl) {
                        // Only update non-container elements.
                        return !fromEl.hasAttribute(CONTAINER_ATTRIBUTE);
                    }
                });

                emitter.end();
            });

            return () => cancelAnimationFrame(loop);
        }));
    }

    if (render) {
        const r$ = render(api, prev, next) || {};

        if (process.env.NODE_ENV !== 'production') {
            assert.ok(r$[$$observable], '`render` should return an Observable');
        }
    }

    return render$;
};

export default curry(renderGenerator);
