/**
 * Accepts a varying number of types, and returns a function that
 * takes an Observable of actions and filters them based on the
 * types provided. Reads `action.type` to match.
 *
 * Checks loosely against action.type, which should always be
 * a string, as this is intended to be used with with the actions
 * emitted from a Redux store. This is exposed so it works with
 * redux-actions' action creator functions, which come with
 * `toString` to allow loose comparison.
 *
 * Intended to be used with Kefir's `thru` method.
 *
 * @param {string[]} types - Action types to filter by.
 * @returns {function(*=): (*|this)} Observable filtering function.
 */
const ofType = (...types) => obs$ => obs$.filter(action => {
    const type = action.type;
    const len = types.length;

    if (len === 1) {
        // eslint-disable-next-line eqeqeq
        return type == types[0];
    } else {
        for (let i = 0; i < len; i++) {
            // eslint-disable-next-line eqeqeq
            if (types[i] == type) {
                return true;
            }
        }
    }
    return false;
})
    .setName(obs$, 'ofType');

export default ofType;
