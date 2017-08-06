import { Internals } from 'diffhtml';
import { BLACKBOX_ATTRIBUTE } from '../constants';
import getNodeKey from './getNodeKey';
import endAsObservable from './endAsObservable';
import patchTask from './patchTask';

const { createNode } = Internals;
const { patchNode } = Internals.tasks;

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
 * Create an instance of the render middleware for diffhtml.
 *
 * @returns {renderTask} Render task middleware.
 */
export default function middleware() {
    let rootRenderNode;

    /**
     * Check if the component is a blackboxed element and ensure it doesn't change.
     *
     * @param {VTree} oldTree - Current tree state.
     * @param {VTree} newTree - New tree state.
     * @returns {VTree} Updated tree state.
     */
    const syncTreeHook = (oldTree, newTree) =>
        oldTree && oldTree.attributes && oldTree.attributes[BLACKBOX_ATTRIBUTE] && createNode(oldTree) !== rootRenderNode
            ? oldTree
            : newTree;

    /**
     * Maintains the current transaction, overwriting
     * the built in patch function with our observable
     * handling.
     *
     * @param {Transaction} transaction - Incoming transaction.
     */
    function renderTask(transaction) {
        rootRenderNode = transaction.domNode;

        const idx = transaction.tasks.indexOf(patchNode);

        transaction.tasks[idx] = patchTask;
        transaction.tasks[idx + 1] = endAsObservable;
    }

    return Object.assign(renderTask, { createTreeHook, syncTreeHook });
}
