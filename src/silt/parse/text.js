import { regex } from './placeholder';

/**
 * Parse the text into an array of children tree nodes.
 *
 * @param {string} text - Text to parseExpression.
 * @param {Expression[]} expressions -
 * @returns {vTreeNode[]} - Array of vTree Node's.
 */
export const parseText = (text, expressions) =>
    text.split(regex)
        .map(val => {
            if (!val) {
                return null;
            }

            if (regex.test(val)) {
                const [match] = val.match(/(\d+)/);

                return expressions[match];
            }

            return ['#text', [], val];
        })
        .filter(child => child !== null);
