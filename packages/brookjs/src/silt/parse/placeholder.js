import { parseExpression, regexWithEscape } from './expression';
import parse from './index';

export const regex = /(__silt_\d+__)/;

/**
 * Find each handlebars expression or block and replace them
 * with the appropriate
 *
 * @param {string} html - HTML string.
 * @returns {[Expression[], string]} Tuple with blocks and replaced html.
 */
export function placeholderize (html) {
    let blocks = [];
    const opens = [];

    let opener = html.indexOf('{{#');
    let closer = html.indexOf('{{/');
    let nextopen = html.indexOf('{{#', opener + 3);

    while (closer > -1) {
        if ((nextopen > -1) && (closer > nextopen)) {
            opens.push(opener);
            opener = nextopen;
            nextopen = html.indexOf('{{#', nextopen + 3);
        } else {
            if (opens.length === 0) {
                if (opener === -1) {
                    throw new Error('Unmatched close block');
                }
                blocks.push([opener, closer]);
            } else {
                opener = opens.pop();
            }
            closer = html.indexOf('{{/', closer + 3);
        }
    }

    if (opens.length > 0) {
        throw new Error('Unmatched open block');
    }

    let cursor = 0;
    let snipped = '';

    blocks = blocks.map((block, idx) => {
        const openexpr = readExpression(html, block[0]);
        const closexpr = readExpression(html, block[1]);

        snipped += html.substr(cursor, block[0] - cursor);
        snipped += blockPlaceholder(idx);

        cursor = block[0] + openexpr.length; // move cursor to the end of the open block tag

        const contents = html.substr(cursor, block[1] - cursor);

        cursor = block[1] + closexpr.length; // move cursor to the end of the close block tag

        block = parseExpression(openexpr);
        block[2] = parse(contents, { root: false })[2];

        return block;
    });

    snipped += html.substr(cursor);

    const expressions = [];

    snipped = snipped.replace(regexWithEscape, match => {
        let placeholder = `__silt_${expressions.length}__`;

        (function escape(match) {
            if (match.startsWith('\\')) {
                const escaped = match[1]; // Find what was escaped.

                // If we're escaping an expression,
                // remove escape char and return as is.
                if (escaped === '{') {
                    placeholder = match.substr(1);
                    return;
                }

                // If we're escaping an escape character,
                // keep it with the placeholder and reparse.
                if (escaped === '\\') {
                    placeholder = '\\' + placeholder;

                    return escape(match.substr(2));
                }
            }

            expressions.push(parseExpression(match));
        })(match);

        return placeholder;
    });

    return [expressions, blocks, snipped];
}

/**
 * Create the processing instruction string for the given index.
 *
 * @param {number} idx - Block index.
 * @returns {string} Processing instruction.
 */
function blockPlaceholder (idx) {
    return `<?hbs ${idx}>`;
}

/**
 * Fetch the expression from a Handlebars expression tag.
 *
 * @param {string} text - Expression tag.
 * @param {number} start - Point to read from.
 * @returns {string} Expression.
 */
function readExpression (text, start) {
    const closer = text.indexOf('}}', start);

    if (!(closer > -1)) {
        throw new Error('Unmatched expression delimiter');
    }

    return text.substr(start, (closer + 2) - start);
}
