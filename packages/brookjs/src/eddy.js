const $$loop = Symbol('@brookjs/loop');
const NONE = Symbol('@brookjs/none');

export const eddy = () => createStore => (reducer, state, enhancer) => {
    let queue = [];

    const upgradeReducer = reducer => (state, action) => {
        const results = reducer(state, action);
        const [nextState, cmd] = results[$$loop] ? results : [results, NONE];

        queue.push(cmd);

        return nextState;
    };

    const store = createStore(upgradeReducer(reducer), state, enhancer);

    const runCommands = run => {
        for (const cmd of run) {
            if (cmd !== NONE) {
                if (Array.isArray(cmd)) {
                    runCommands(cmd);
                } else {
                    store.dispatch(cmd);
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
