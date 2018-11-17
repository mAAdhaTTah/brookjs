const $$loop = Symbol('@brookjs/loop');
const NONE = Symbol('@brookjs/none');

const normalizeResults = results => results[$$loop] ? results : [results, NONE];

export const eddy = () => createStore => (reducer, state, enhancer) => {
    let queue = [];

    const upgradeReducer = reducer => (state, action) => {
        const [nextState, cmd] = normalizeResults(reducer(state, action));

        if (cmd !== NONE) {
            queue.push(cmd);
        }

        return nextState;
    };

    const store = createStore(upgradeReducer(reducer), state, enhancer);

    const runCommands = run => {
        for (const cmd of run) {
            if (cmd !== NONE) {
                if (Array.isArray(cmd)) {
                    runCommands(cmd);
                } else {
                    // mutually recursive
                    // eslint-disable-next-line no-use-before-define
                    dispatch(cmd);
                }
            }
        }
    };

    const dispatch = action => {
        store.dispatch(action);
        const run = queue;
        queue = [];

        runCommands(run);

        return action;
    };

    const replaceReducer = reducer =>
        store.replaceReducer(upgradeReducer(reducer));

    return {
        ...store,
        dispatch,
        replaceReducer
    };
};

export const loop = (state, action) => {
    const results = [state, action];
    results[$$loop] = true;

    return results;
};

loop.NONE = NONE;

export const combineReducers = reducerMap => {
    const reducerKeys = Object.keys(reducerMap);

    return (state = {}, action) => {
        let hasChanged = false;
        const nextState = {};
        const cmds = [];

        for (let i = 0; i < reducerKeys.length; i++) {
            const key = reducerKeys[i];
            const reducer = reducerMap[key];
            const previousStateForKey = state[key];
            const [nextStateForKey, cmd] = normalizeResults(
                reducer(previousStateForKey, action)
            );

            if (cmd !== NONE) {
                cmds.push(cmd);
            }

            hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
            nextState[key] = nextStateForKey;
        }

        return loop(
            hasChanged ? nextState : state,
            cmds
        );
    };
};
