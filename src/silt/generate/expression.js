import { VARIABLE } from '../parse/expression';

/**
 * Handles an expression's meta
 *
 * @param {ExpressionMeta} meta - Expression meta object.
 * @param {Object} context - Context object.
 * @returns {vTree} Generated vTree.
 */
export function handleExpression (meta, context) {
    switch (meta.expression) {
        case VARIABLE:
            return ['#text', context[meta.name]];
        default:
            return null;
    }
}
