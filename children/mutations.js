import { CONTAINER_ATTRIBUTE, KEY_ATTRIBUTE } from '../constants';
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
            // @todo this logic could be much better
            Array.from(mutation.addedNodes).forEach(node => {
                if (!node.querySelectorAll) {
                    return;
                }

                if (isRelevantNode(node)) {
                    emitter.value(nodeAdded(mutation.target, node));
                } else {
                    Array.from(node.querySelectorAll(`[${CONTAINER_ATTRIBUTE}]`)).forEach(container => {
                        let parent = container.parentNode;

                        while (parent && parent !== node && !isRelevantNode(parent)) {
                            parent = parent.parentNode;
                        }

                        if (parent && parent === node) {
                            emitter.value(nodeAdded(mutation.target, container));
                        }
                    });
                }
            });

            Array.from(mutation.removedNodes).forEach(node => {
                if (!node.querySelectorAll) {
                    return;
                }

                if (isRelevantNode(node)) {
                    emitter.value(nodeRemoved(mutation.target, node));
                } else {
                    Array.from(node.querySelectorAll(`[${CONTAINER_ATTRIBUTE}]`)).forEach(container => {
                        let parent = container.parentNode;

                        while (parent && parent !== node && !isRelevantNode(parent)) {
                            parent = parent.parentNode;
                        }

                        if (parent && parent === node) {
                            emitter.value(nodeRemoved(mutation.target, container));
                        }
                    });
                }
            });
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
