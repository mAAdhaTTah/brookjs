import { parseExpression, regex as expressionRegex } from './expression';

export const regex = /(__SILT_\d+__)/;

/**
 * Find each handlebars expression or block and replace them
 * with the appropriate
 *
 * @param {string} html - HTML string.
 * @returns {[Expression[], string]} Tuple with blocks and replaced html.
 */
export function placeholderize (html) {
    const expressions = [];
    const blocks = [];

    html = html.replace(expressionRegex, match => {
        const placeholder = `__SILT_${expressions.length}__`;

        expressions.push(parseExpression(match));

        return placeholder;
    });

    return [expressions, blocks, html];
}
