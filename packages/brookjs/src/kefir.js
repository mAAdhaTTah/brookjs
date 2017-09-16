import Kefir from 'kefir';

class ActionObservable extends Kefir.Pool {
    /**
     * Filter the actions$ stream to just emit actions of
     * the provided types.
     *
     * @param {Array<string>} types - Action types to filter.
     * @returns {Observable<Action>} Stream of filtered actions.
     */
    ofType(...types) {
        return this.filter(action => {
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
        });
    }
}

function actions() {
    return new ActionObservable();
}

Object.assign(Kefir, { ActionObservable, actions });

export default Kefir;
