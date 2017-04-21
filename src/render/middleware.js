import { BLACKBOX_ATTRIBUTE } from '../constants';
import getNodeKey from './getNodeKey';
import endAsObservable from './endAsObservable';

/**
 * Adds the key for every newly created tree.
 *
 * @param {VTree} tree - New tree.
 * @returns {VTree} Updated tree.
 */
const createTreeHook = tree => {
    tree.key = getNodeKey(tree);

    return tree;
};

/**
 * Check if the component is a child
 *
 * @param {VTree} oldTree - Current tree state.
 * @param {VTree} newTree - New tree state.
 * @returns {VTree} Updated tree state.
 */
const syncTreeHook = (oldTree, newTree) =>
    oldTree && oldTree.attributes && oldTree.attributes[BLACKBOX_ATTRIBUTE]
        ? oldTree
        : newTree;

/**
 * Create an instance of the render middleware for diffhtml.
 *
 * @returns {renderTask} Render task middleware.
 */
export default function middleware() {
    /**
     * Maintains the current transaction, overwrites
     * the built in patch function with our observable
     * handling.
     *
     * @param {Transaction} transaction - Incoming transaction.
     */
    function renderTask(transaction) {
        transaction.tasks.push(endAsObservable);
    }

    return Object.assign(renderTask, { createTreeHook, syncTreeHook });
}
