/**
 * Accepts a varying number of types, and returns a function that
 * takes an Observable of actions and filters them based on the
 * types provided. Reads `action.type` to match.
 *
 * Intended to be used with Kefir's `thru` method.
 *
 * @param {string[]} types - Action types to filter by
 * @returns {function(*=): (*|this)} Observable filtering function.
 */
const ofType = (...types) => obs$ => obs$.filter(action => {
    const type = action.type;
    const len = types.length;

    if (len === 1) {
        return type === types[0];
    } else {
        for (let i = 0; i < len; i++) {
            if (types[i] === type) {
                return true;
            }
        }
    }
    return false;
})
    .setName(obs$, 'ofType');

export default ofType;
