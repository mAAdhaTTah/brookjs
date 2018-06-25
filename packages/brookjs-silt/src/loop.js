import R from 'ramda';

const child$s = new WeakMap();

const getChildStream = (stream$, id) => {
    let childs = child$s.get(stream$);

    if (!childs) {
        child$s.set(stream$, childs = {});
    }

    if (childs[id]) {
        // The Source's value maps to the value in
        // the generated Observable, through the Map,
        // which Flow can't trace through.
        return childs[id];
    }

    return childs[id] = stream$.map(props => props.dict[id]);
};

const orderMatches = (prev, next) => R.equals(prev.order, next.order);
const id = x => x;

export default function loop(mapper, callback) {
    if (callback == null) {
        callback = mapper;
        mapper = id;
    }

    return (stream$) => {
        const src$ = stream$.map(mapper);

        return src$.skipDuplicates(orderMatches)
            .map(props => props.order.map(id => callback(getChildStream(src$, id), id)));
    };
}
