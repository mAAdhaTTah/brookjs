// @flow
import type { Observable } from 'kefir';
import R from 'ramda';

export default <V, V2>(callback: V => V2) => (stream$: Observable<V>): Observable<V2> => {
    let previous;

    return stream$.withHandler((emitter, event) => {
        switch (event.type) {
            case 'end':
                emitter.end();
                break;
            case 'error':
                emitter.error(event.value);
                break;
            case 'value':
                const next = callback(event.value);

                if (!R.equals(next, previous)) {
                    emitter.value(next);
                    previous = next;
                }
                break;
        }
    });
};
