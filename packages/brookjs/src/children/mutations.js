import R from 'ramda';
import { CONTAINER_ATTRIBUTE, KEY_ATTRIBUTE } from '../constants';
import Kefir from '../kefir';
import { nodeAdded, nodeRemoved } from './actions';
import { getContainerNode, dedupeListOfMutationActions } from './util';

/**
 * Determines whether the node is a brook container node.
 *
 * @param {Node} node - Node to check.
 * @returns {boolean} Whether node is relevant to children$ streams.
 */
function isContainerNode(node) {
    return !!(node.hasAttribute && node.hasAttribute(CONTAINER_ATTRIBUTE));
}

/**
 * Maps a removed node and its target to an array of mutation actions.
 *
 * @param {Element} target - Node target for addition.
 * @param {Element} node - Node added to the target.
 * @return {Array<Action>} Array of mutation actions.
 */
const mapAddedNodeToActions = R.curry((target, node) => {
    if (!node.querySelectorAll) {
        return [];
    }

    if (isContainerNode(node)) {
        return [nodeAdded(target, node)];
    }

    const added = [];
    R.forEach(container => {
        let parent = container.parentNode;

        while (parent && parent !== node && !isContainerNode(parent)) {
            parent = parent.parentNode;
        }

        if (parent && parent === node) {
            added.push(nodeAdded(target, container));
        }
    }, node.querySelectorAll(`[${CONTAINER_ATTRIBUTE}]`));

    return added;
});

/**
 * Maps a removed node to its array of mutation actions.
 *
 * @param {Element} target - Node target for removal.
 * @param {Element} node - Node removed from the target.
 * @return {Array<Action>} Mutation Actions.
 */
const mapRemovedNodeToActions = R.curry((target, node) => {
    if (!node.querySelectorAll) {
        return [];
    }

    if (isContainerNode(node)) {
        return [nodeRemoved(target, node)];
    }

    const removed = [];

    R.forEach(container => {
        let parent = container.parentNode;

        while (parent && parent !== node && !isContainerNode(parent)) {
            parent = parent.parentNode;
        }

        if (parent && parent === node) {
            removed.push(nodeRemoved(target, container));
        }
    }, node.querySelectorAll(`[${CONTAINER_ATTRIBUTE}]`));

    return removed;
});

/**
 * Maps a MutationRecord to its array of mutation actions.
 *
 * @param {MutationRecord} record - MutationRecord to map.
 * @returns {Array<Action>} Array of mutation actions.
 */
function mapRecordsToActions(record) {
    return R.concat(
        R.chain(mapAddedNodeToActions(record.target), record.addedNodes),
        R.chain(mapRemovedNodeToActions(record.target), record.removedNodes)
    );
}

/**
 * Map simple actions to new actions with additional data.
 *
 * @param {string} type - Action type.
 * @param {Object} payload - Action payload.
 * @returns {Action} New Action with additional data.
 */
function mapActionsWithExtraData({ type, payload }) {
    const { node, target } = payload;
    const container = node.getAttribute(CONTAINER_ATTRIBUTE);
    const key = node.getAttribute(KEY_ATTRIBUTE);
    const parent = getContainerNode(node.parentNode) || getContainerNode(target);

    return {
        type,
        payload: { container, key, node, parent, target }
    };
}

/**
 * Stream of node additions and removals from the DOM.
 *
 * Filtered for relevance to subcomponents and formatted as an action.
 *
 * @type {Observable<T, S>}
 */
export default Kefir.stream(emitter => {
    const observer = new MutationObserver(emitter.value);

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    return () => observer.disconnect();
})
    .flatten(R.pipe(
        R.chain(mapRecordsToActions),
        dedupeListOfMutationActions,
        R.map(mapActionsWithExtraData)
    ));
