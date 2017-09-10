import R from 'ramda';

/**
 * Parses the attributes into an array of key/value instructions.
 *
 * @param {Object} attributes - Key/value has of attributes.
 * @returns {Attribute[]} Array of Attribute instruction tuples.
 */
export default function parseAttributes(attributes) {
    return R.toPairs(attributes);
}
