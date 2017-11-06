import patchAsObservable from './patchAsObservable';

/**
 * Replacement patch task that actually updates the DOM.
 *
 * @param {Transaction} transaction - Current running transaction.
 */
export default function patchTask(transaction) {
    const { state: { measure, internals }, patches, observables = [] } = transaction;

    measure('patch node (observable)');
    observables.push(...patchAsObservable(patches, internals));
    measure('patch node (observable)');

    transaction.observables = observables;
}
