import R from 'ramda';
import { CONTAINER_ATTRIBUTE } from '../constants';
import { NODE_ADDED, NODE_REMOVED } from './actions';

export const isChildNode = el => R.converge(R.or, [
    R.pipe(R.path(['payload', 'parent']), R.equals(el)),
    R.pipe(R.path(['payload', 'target']), R.equals(el)),
]);

export const isAddedChildNode = el => R.converge(R.and, [
    isChildNode(el),
    R.pipe(R.prop('type'), R.equals(NODE_ADDED))
]);

export const isRemovedChildNode = el => R.converge(R.and, [
    isChildNode(el),
    R.pipe(R.prop('type'), R.equals(NODE_REMOVED))
]);

export const containerMatches = container => R.pipe(R.prop('container'), R.equals(container));

/**
 * Returns the container node of the provided node.
 *
 * @param {Node} parent - Parent node to check.
 * @returns {null|Node} Parent containr node.
 */
export function getContainerNode(parent) {
    if (!parent) {
        return null;
    }

    if (parent.hasAttribute && parent.hasAttribute(CONTAINER_ATTRIBUTE)) {
        return parent;
    }

    return getContainerNode(parent.parentNode);
}
