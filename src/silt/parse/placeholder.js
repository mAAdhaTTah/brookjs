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

    return [expressions, blocks, html];
}
