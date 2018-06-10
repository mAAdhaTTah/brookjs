// @flow
import type { Observable } from 'kefir';
import R from 'ramda';
import * as React from 'react';

opaque type Key = string | number;

type Loopable<P> = { order: Array<Key>, dict: { [key: Key]: P } };
type Callback<P> = (Observable<P>, Key) => React.Node | Observable<React.Node>;
type Source<P> = Observable<Loopable<P>>;

const child$s: WeakMap<Observable<*>, { [key: Key]: Observable<*> }> = new WeakMap();

const getChildStream = <P>(stream$: Source<P>, id: Key): Observable<P> => {
    let childs = child$s.get(stream$);

    if (!childs) {
        child$s.set(stream$, childs = {});
    }

    if (childs[id]) {
        // The Source's value maps to the value in
        // the generated Observable, through the Map,
        // which Flow can't trace through.
        return (childs[id]: any);
    }

    return childs[id] = stream$.map(props => props.dict[id]);
};

const orderMatches = <P>(prev: Loopable<P>, next: Loopable<P>) => R.equals(prev.order, next.order);

declare function loop<P>(mapper: Callback<P>): ((stream$: Source<P>) => Observable<P>)
declare function loop<P>(mapper: (x: any) => Loopable<P>, callback: Callback<P>): ((stream$: Source<P>) => Observable<P>)
export default function loop<P>(mapper, callback) {
    if (callback == null) {
        callback = mapper;
        mapper = (x: any): Loopable<P> => x;
    }

    return (stream$: Source<P>) => {
        // $FlowFixMe
        const src$ = stream$.map(mapper);

        return src$.skipDuplicates(orderMatches)
            // $FlowFixMe
            .map(props => props.order.map(id => callback(getChildStream(src$, id), id)));
    };
}
