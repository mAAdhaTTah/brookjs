import R from 'ramda';

/**
 * Node added action constant.
 *
 * @type {string}
 */
export const NODE_ADDED = 'NODE_ADDED';

/**
 * Creates a new NODE_ADDED action.
 *
 * @param {Node} target - Mutation target.
 * @param {Node} node - Node added.
 * @returns {Action} Node added action.
 */
export const nodeAdded = R.curry(function nodeAdded(target, node) {
    return {
        type: NODE_ADDED,
        payload: { target, node }
    };
});

/**
 * Node removed action constant.
 *
 * @type {string}
 */
export const NODE_REMOVED = 'NODE_REMOVED';

/**
 * Creates a new NODE_REMOVED action.
 *
 * @param {Node} target - Mutation target.
 * @param {Node} node - Node removed.
 * @returns {Action} Node removed action.
 */
export const nodeRemoved = R.curry(function nodeRemoved(target, node) {
    return {
        type: NODE_REMOVED,
        payload: { target, node }
    };
});
