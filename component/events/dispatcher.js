import { constant, merge, pool } from 'kefir';

export default function dispatcher(config) {
    let dispatchable = {};
    let streams = Object.keys(config).map(
        key => config[key](dispatchable[key] = pool()));

    const dispatch = function dispatch(key, event) {
        const stream$ = dispatchable[key];

        if (stream$) {
            stream$.plug(constant(event));
        }
    };

    dispatch.events$ = merge(streams);

    return dispatch;
}
