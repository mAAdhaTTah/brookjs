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

/**
 * Adds the provided action to the array if it's not a duplicate,
 * and removes Actions that cancel each other out.
 *
 * @param {Array<Action>} acc - List of accumulated actions.
 * @param {Action} action - Next action to add.
 * @returns {Array<Action>} New list of actions.
 */
function accumulateUniqueNodes(acc, action) {
    const listOfNodes = acc.map(R.path(['payload', 'node']));
    const indexOfNode = listOfNodes.indexOf(action.payload.node);

    if (indexOfNode !== -1) {
        // Since there are only two types of actions, if they
        // don't match here but have the same node, it means
        // one was an `ADDED` and one was a `REMOVED`, so they
        // cancel each other out, so remove both.
        if (acc[indexOfNode].type !== action.type) {
            acc.splice(indexOfNode, 1);
        }

        return acc;
    }

    return acc.concat(action);
}

export const dedupeListOfMutationActions = R.pipe(
    R.groupWith((a, b) => a.payload.node === b.payload.node),
    R.map(R.groupWith((a, b) => a.type === b.type)),
    R.map(actions => {
        // If only one type, than use it.
        if (actions.length === 1) {
            return actions[0];
        }

        if (actions[0].length === actions[1].length) {
            return [];
        }

        if (actions[0].length > actions[1].length) {
            return actions[0][0];
        }

        return actions[1][0];
    }),
    R.flatten,
    R.reduce(accumulateUniqueNodes, [])
);
