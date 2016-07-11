import { EVENT_ATTRIBUTES } from '../events';

export default function event(event, callback) {
    const attr = EVENT_ATTRIBUTES[event];

    if (!attr) {
        return `data-brk-unknown="${event}"`;
    }

    return `${attr}="${callback}"`;
};
