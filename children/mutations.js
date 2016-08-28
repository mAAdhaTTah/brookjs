import R from 'ramda';
import { CONTAINER_ATTRIBUTE } from '../events';
import { stream } from 'kefir';
import { nodeAdded, nodeRemoved } from './actions';
import { getContainerNode } from './util';

/**
 * Determines whether the node is relevant to stream consumers.
 *
 * @param {Node} node - Node to check.
 * @returns {boolean} Whether node is relevant to children$ streams.
 */
function isRelevantNode(node) {
    return !!(node.hasAttribute && node.hasAttribute(CONTAINER_ATTRIBUTE));

}

/**
 * Stream of node additions and removals from the DOM.
 *
 * Filtered for relevance to subcomponents and formatted as an action.
 *
 * @type {Observable<T, S>}
 */
export default stream(emitter => {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            Array.from(mutation.addedNodes)
                .forEach(R.pipe(nodeAdded(mutation.target), emitter.value));

            Array.from(mutation.removedNodes)
                .forEach(R.pipe(nodeRemoved(mutation.target), emitter.value));
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    return () => observer.disconnect();
})
    .filter(
        R.pipe(
            R.path(['payload', 'node']),
            isRelevantNode))
    .map(({ type, payload }) => {
        let { node, target } = payload;
        let key = node.getAttribute(CONTAINER_ATTRIBUTE);
        let parent = getContainerNode(node.parentNode) || getContainerNode(target);

        return {
            type,
            payload: { key, node, parent, target }
        };
    });
