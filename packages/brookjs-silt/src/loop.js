const child$s = new WeakMap();

const getChildStream = (stream$, id) => {
    let childs = child$s.get(stream$);

    if (!childs) {
        child$s.set(stream$, childs = {});
    }

    if (childs[id]) {
        return childs[id];
    }

    return childs[id] = stream$.map(props => props.dict[id]);
};

const orderMatches = (prev, next) => prev.order === next.order;
const id = x => x;

export default function loop(mapper, callback) {
    if (callback == null) {
        callback = mapper;
        mapper = id;
    }

    return stream$ => {
        const src$ = stream$.map(mapper);

        return src$.skipDuplicates(orderMatches)
            .map(props => props.order.map(id => callback(getChildStream(src$, id), id)));
    };
}
