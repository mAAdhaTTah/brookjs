import Kefir from '../../kefir';
import { $$meta } from '../constants';

/**
 * Create Transaction end stream.
 *
 * @param {Transaction} transaction - Ending transaction.
 * @returns {Observable<void>} Transaction end stream.
 */
const createEnd = transaction => {
    const end$ = Kefir.stream(emitter => {
        transaction.end();
        emitter.end();
    });

    end$[$$meta] = { type: 'END', payload: {} };

    return end$;
};

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

    return Kefir.constant([...observables, ...promises.map(Kefir.fromPromise), end$])
        .flatten();
}
