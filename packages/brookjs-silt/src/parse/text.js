// @flow
import R from 'ramda';
import type { SiltExpressionNode, SiltNode } from '../ast';
import { regex } from './placeholder';

/**
 * Parse the text into an array of children tree nodes.
 *
 * @param {string} text - Text to parseExpression.
 * @param {Expression[]} expressions -
 * @returns {vTreeNode[]} - Array of vTree Node's.
 */
export const parseText = (text: string, expressions: Array<SiltExpressionNode>): Array<SiltNode> => {
    const texts = text.split(regex);
    const nodes = [];

    for (const val of texts) {
        if (val === '') {
            continue;
        }

        if (regex.test(val)) {
            const match = val.match(/(\d+)/);

            // == intended for flow to pass
            if (match == null || typeof match[0] === 'undefined') {
                continue;
            }

            const item = R.nth(parseInt(match[0], 10), expressions);

            if (item) {
                nodes.push(item);
            }
        } else {
            nodes.push(['#text', [], val]);
        }
    }

    return nodes;
};
