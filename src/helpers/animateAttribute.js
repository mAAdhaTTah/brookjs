import { ANIMATE_ATTRIBUTE } from '../constants';

/**
 * Create a new HTML animate attribute for.
 *
 * @param {string} key - Animation key.
 * @returns {string} Animation HTML attribute.
 */
export default function animateAttribute(key) {
    return `${ANIMATE_ATTRIBUTE}="${key}"`;
}
