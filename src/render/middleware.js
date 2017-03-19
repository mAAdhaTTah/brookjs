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
        tree.key = '';

        if (tree.attributes[CONTAINER_ATTRIBUTE]) {
            tree.key = tree.attributes[CONTAINER_ATTRIBUTE];

            if (tree.attributes[KEY_ATTRIBUTE]) {
                tree.key += `::${tree.attributes[KEY_ATTRIBUTE]}`;
            }
        }

        if (tree.attributes[BLACKBOX_ATTRIBUTE]) {
            if (tree.key) {
                tree.key += '::';
            }

            tree.key += tree.attributes[BLACKBOX_ATTRIBUTE];
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
        if (oldTree && oldTree.attributes[BLACKBOX_ATTRIBUTE]) {
            return oldTree;
        }

        return newTree;


    };

    return renderTask;
}
