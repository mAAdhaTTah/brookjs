import { NodeCache } from 'diffhtml/util';
import { CONTAINER_ATTRIBUTE, KEY_ATTRIBUTE } from '../constants';

/**
 * Create an instance of the render middleware for diffhtml.
 *
 * @returns {renderTask} Render task middleware.
 */
export default function renderMiddleware() {
    let currentTransaction;

    /**
     * Maintains the current transaction, overwrites
     * the built in patch function with our observable
     * handling.
     *
     * @param {Transaction} transaction - Incoming transaction.
     * @returns {Function} Post-transaction callback.
     */
    function renderTask(transaction) {
        currentTransaction = transaction;

        return () => {
            currentTransaction = undefined;
        };
    }

    /**
     * Adds the key for every newly created tree.
     *
     * @param {VTree} tree - New tree.
     * @returns {VTree} Updated tree.
     */
    renderTask.createTreeHook = tree => {
        if (tree.attributes[CONTAINER_ATTRIBUTE] && tree.attributes[KEY_ATTRIBUTE]) {
            tree.key = `${tree.attributes[CONTAINER_ATTRIBUTE]}::${tree.attributes[KEY_ATTRIBUTE]}`;
        } else {
            // Tree should not have an attribute if above condition doesn't match.
            tree.key = '';
        }

        return tree;
    };

    /**
     * Check if the component is a child
     *
     * @param {VTree} oldTree - Current tree state.
     * @param {VTree} newTree - New tree state.
     * @returns {VTree} Updated tree state.
     */
    renderTask.syncTreeHook = (oldTree, newTree) => {
        // If this is a new tree, we're going to copy anything.
        if (!oldTree) {
            return newTree;
        }

        if (typeof newTree.attributes[CONTAINER_ATTRIBUTE] === 'undefined') {
            return newTree;
        }

        if (newTree.attributes[CONTAINER_ATTRIBUTE] !== oldTree.attributes[CONTAINER_ATTRIBUTE]) {
            return newTree;
        }

        // If it has a key, then it has a data-brk-key attribute, which
        // means the keys have to match for them to be the same tree.
        if (newTree.key && newTree.key !== oldTree.key) {
            return newTree;
        }

        // The root node's tree needs to be updated.
        const existingNode = NodeCache.get(oldTree) || NodeCache.get(newTree);
        if (existingNode && existingNode === currentTransaction.domNode) {
            return newTree;
        }

        // If all these conditions are met, then we have found a child
        // container that should not be updated.
        return oldTree;

    };

    return renderTask;
}
