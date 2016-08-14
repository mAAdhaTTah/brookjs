import R from 'ramda';

export default R.curry(function mapActionTo(source, dest, { type, payload }) {
    if (type === source) {
        type = dest;
        payload = Object.assign({}, payload, { source });
    }

    return { type, payload };
});
