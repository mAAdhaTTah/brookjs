import { KEY_ATTRIBUTE } from '../constants';

/**
 * Generates a HTML attribute for a key.
 *
 * @param {string} key - Key value.
 * @returns {string} Key attribute.
 */
export default function keyAttribute(key) {
    return `${KEY_ATTRIBUTE}="${key}"`;
}
