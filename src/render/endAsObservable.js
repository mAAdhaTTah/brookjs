import { fromPromise, stream } from 'kefir';

/**
 * Terminate the transaction by returning an Observable instead of a Promise.
 *
 * @param {Transaction} transaction - Transaction object.
 * @returns {Observable} Render observable.
 */
export default function endAsObservable(transaction) {
    const { promises = [] } = transaction;

    const end$ = stream(emitter => {
        transaction.end();
        emitter.end();
    });

    if (!promises.length) {
        return end$;
    }

    return fromPromise(Promise.all(promises)).ignoreValues().concat(end$);
}
