// @flow
import type { Observable } from 'kefir';
import R from 'ramda';
import * as React from 'react';

opaque type Key = string | number;

type Iteration<P> = { order: Array<Key>, dict: { [key: Key]: P } };
type Callback<P> = (Observable<P>, Key) => React.Node | Observable<React.Node>;
type Source<P> = Observable<Iteration<P>>;

const child$s: Map<Observable<*>, { [key: Key]: Observable<*>}> = new Map();

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

const orderMatches = <P>(prev: Iteration<P>, next: Iteration<P>) => R.equals(prev.order, next.order);

export default <P> (callback: Callback<P>) => (stream$: Source<P>) =>
    stream$.skipDuplicates(orderMatches)
        .map(props => props.order.map(id => callback(getChildStream(stream$, id), id)));
