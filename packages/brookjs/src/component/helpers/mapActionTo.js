import R from 'ramda';

export default R.curry(function mapActionTo(source, dest, action) {
    if (action.type !== source) {
        return action;
    }

    const { meta = {}, ...rest } = action;

    return {
        ...rest,
        type: dest,
        meta: {
            ...meta,
            sources: (meta.sources || []).concat(source)
        }
    };
});
