import Kefir from '../kefir';

/**
 * Create Transaction end stream.
 *
 * @param {Transaction} transaction - Ending transaction.
 * @returns {Observable<void>} Transaction end stream.
 */
const createEnd = transaction => Kefir.stream(emitter => {
    transaction.end();
    emitter.end();
});

/**
 * Terminate the transaction by returning an Observable instead of a Promise.
 *
 * @param {Transaction} transaction - Transaction object.
 * @returns {Observable} Render observable.
 */
export default function endAsObservable(transaction) {
    const { observables = [], promises = [] } = transaction;

    const end$ = createEnd(transaction);

    if (!observables.length && !promises.length) {
        return end$;
    }

    return Kefir.concat([
        Kefir.merge([...observables, ...promises.map(Kefir.fromPromise)]),
        end$
    ]);
}
