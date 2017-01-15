import R from 'ramda';
import { CONTAINER_ATTRIBUTE, KEY_ATTRIBUTE } from '../constants';
import { stream } from 'kefir';
import { nodeAdded, nodeRemoved } from './actions';
import { getContainerNode } from './util';

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
 * Stream of node additions and removals from the DOM.
 *
 * Filtered for relevance to subcomponents and formatted as an action.
 *
 * @type {Observable<T, S>}
 */
export default stream(emitter => {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // @todo this logic could be much better
            R.forEach(node => {
                if (!node.querySelectorAll) {
                    return;
                }

                if (isContainerNode(node)) {
                    emitter.value(nodeAdded(mutation.target, node));
                } else {
                    R.forEach(container => {
                        let parent = container.parentNode;

                        while (parent && parent !== node && !isContainerNode(parent)) {
                            parent = parent.parentNode;
                        }

                        if (parent && parent === node) {
                            emitter.value(nodeAdded(mutation.target, container));
                        }
                    }, node.querySelectorAll(`[${CONTAINER_ATTRIBUTE}]`));
                }
            }, mutation.addedNodes);

            R.forEach(node => {
                if (!node.querySelectorAll) {
                    return;
                }

                if (isContainerNode(node)) {
                    emitter.value(nodeRemoved(mutation.target, node));
                } else {
                    R.forEach(container => {
                        let parent = container.parentNode;

                        while (parent && parent !== node && !isContainerNode(parent)) {
                            parent = parent.parentNode;
                        }

                        if (parent && parent === node) {
                            emitter.value(nodeRemoved(mutation.target, container));
                        }
                    }, node.querySelectorAll(`[${CONTAINER_ATTRIBUTE}]`));
                }
            }, mutation.removedNodes);
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
    .map(({ type, payload }) => {
        let { node, target } = payload;
        let container = node.getAttribute(CONTAINER_ATTRIBUTE);
        let key = node.getAttribute(KEY_ATTRIBUTE);
        let parent = getContainerNode(node.parentNode) || getContainerNode(target);

        return {
            type,
            payload: { container, key, node, parent, target }
        };
    });
