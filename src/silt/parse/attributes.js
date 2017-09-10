import R from 'ramda';
import { parseText } from './text';

const parseAttribute = (text, expressions) => {
    const results = parseText(text, expressions)[0];

    if (results[0] === '#text') {
        return results[1];
    }

    return results;
};

/**
 * Parses the attributes into an array of key/value instructions.
 *
 * @param {Object} attributes - Key/value has of attributes.
 * @param expressions
 * @returns {Attribute[]} Array of Attribute instruction tuples.
 */
export default function parseAttributes(attributes, expressions) {
    return R.toPairs(attributes).map(([key, value]) =>
        [parseAttribute(key, expressions), parseAttribute(value, expressions)]);
}
