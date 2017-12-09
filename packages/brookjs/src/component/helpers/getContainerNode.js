import { CONTAINER_ATTRIBUTE } from '../constants';

/**
 * Returns the container node of the provided node.
 *
 * @param {Node} parent - Parent node to check.
 * @returns {null|Node} Parent containr node.
 */
export default function getContainerNode(parent) {
    if (!parent) {
        return null;
    }

    if (parent.hasAttribute && parent.hasAttribute(CONTAINER_ATTRIBUTE)) {
        return parent;
    }

    return getContainerNode(parent.parentNode);
}
