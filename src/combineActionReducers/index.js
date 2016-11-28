import R from 'ramda';

export default R.reduce((func, [type, reducer]) => {
    return (state, action) => {
        if (action.type === type) {
            state = reducer(state, action);
        }

        return func(state, action);
    };
}, R.identity);
