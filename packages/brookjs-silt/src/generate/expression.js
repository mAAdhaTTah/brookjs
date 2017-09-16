// @flow
import type { ExpressionMeta, SiltNode } from '../ast';
import { getContextValue } from '../context';

/**
 * Handles an expression's meta
 *
 * @param {ExpressionMeta} meta - Expression meta object.
 * @param {Object} context - Context object.
 * @returns {vTree} Generated vTree.
 */
export function handleExpression (meta: ExpressionMeta, context: Object = {}) : string | SiltNode {
    switch (meta.expr) {
        case 'variable':
            return getContextValue(meta.name, context);
        default:
            return '';
    }
}
