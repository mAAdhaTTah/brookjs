/**
 * Parse the text into an array of children tree nodes.
 *
 * @param {string} text - Text to parse.
 * @returns {vTreeNode[]} - Array of vTree Node's.
 */
export default function parseText (text) {
    const children = [];

    if (text) {
        children.push(['#text', text]);
    }

    return children;
}
