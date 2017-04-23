import { patchNode } from 'diffhtml/lib/node';

/**
 * Replacement patch task that actually updates the DOM.
 *
 * @param {Transaction} transaction - Current running transaction.
 */
export default function patchTask(transaction) {
    const { state: { measure, internals }, patches, promises = [] } = transaction;

    measure('patch node (observable)');
    promises.push(...patchNode(patches, internals));
    measure('patch node (observable)');

    transaction.promises = promises;
}
