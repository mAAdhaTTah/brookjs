import R from 'ramda';
import { handleExpression } from './expression';

/**
 * Applies the provided context to the attributes tuples.
 *
 * @param {Attribute[]} attributes - Array of attribute key/value tuples.
 * @param {Object} context - Context to apply to it.
 * @returns {Object} Attribute dictionary.
 */
export function generateAttributes (attributes, context) {
    return R.fromPairs(R.map(([key, value]) => {
        if (Array.isArray(key)) {
            key = handleExpression(key[1], context);
        }

        if (Array.isArray(value)) {
            value = handleExpression(value[1], context);
        }

        return [key, value];
    }, attributes));
}
