export const regex = /(\{\{\{?)([a-zA-Z\s\-_]+)(\}\}\}?)/g;

export const VARIABLE = 'VARIABLE';

/**
 * Compiles a Handlebars expression into a precompiled template spec.
 *
 * @param {string} text - Handlebars expressiong, like '{{variable}}'.
 * @returns {Object} Precompiled template spec.
 */
export function parseExpression(text) {
    let context, args;

    const [,open, contents,] = regex.exec(text);

    const name = readName(contents);

    const type = 'hbs:expression';
    const expression = VARIABLE;
    const unescaped = open === '{{{';

    return [type, { expression, name, unescaped, context, args }];
}

/**
 * Reach value from expression, delimited by " ' or space..
 *
 * @param {string} text - Text to read value from.
 * @param {number} start - Where to start reading from.
 * @returns {string} Value extracted from expression/
 */
function readName(text, start = 0) {
    const chr = text[start];

    if ((chr === '"') || (chr === '\'')) {
        return chr + readUntil(text, start + chr.length, chr) + chr;
    }

    return readUntil(text, start, ' ').trim();
}

/**
 * Read chunk of string from start index to end string.
 *
 * @param {string} text - Expression to read.
 * @param {number} start - Index to start reading at.
 * @param {string} endStr - End string to look for.
 * @returns {string} Chunk of string.
 */
function readUntil(text, start, endStr) {
    let closer = start;

    do {
        closer = text.indexOf(endStr, closer);
    } while (closer > 0 && (text[closer - 1] === '\\'));

    if (closer < 0) {
        return text.substr(start);
    }

    return text.substr(start, closer - start);
}
