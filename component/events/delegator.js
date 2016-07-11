import { CONTAINER_ATTRIBUTE, EVENT_ATTRIBUTES } from './index';
import dispatcher from './dispatcher';

const DISPATCHERS = new WeakMap();

const CLICK = 'click';
const FOCUS = 'focus';

const SUPPORTED_EVENTS = [CLICK, FOCUS];
const CAPTURE = {
    [CLICK]: false,
    [FOCUS]: true
};

const LISTENERS = {
    [CLICK]: function click(ev) {
        let target = ev.target;

        while (target !== document.body) {
            if (target.hasAttribute(EVENT_ATTRIBUTES[CLICK])) {
                let parent = target;

                while (!parent.hasAttribute(CONTAINER_ATTRIBUTE)) {
                    parent = parent.parentNode;
                }

                if (DISPATCHERS.has(parent)) {
                    let dispatch = DISPATCHERS.get(parent);

                    dispatch(target.getAttribute(EVENT_ATTRIBUTES[CLICK]), ev);
                }
            }

            target = target.parentNode;
        }
    }
};
const DELEGATED = {
    [CLICK]: false
};

function registerListeners() {
    SUPPORTED_EVENTS.forEach(event => {
        if (DELEGATED[event]) {
            return;
        }

        if (document.querySelector(`[${EVENT_ATTRIBUTES[event]}]`)) {
            document.documentElement.addEventListener(event, LISTENERS[event], CAPTURE[event]);
            DELEGATED[event] = true;
        }
    });
}

export function delegateElement(config, el) {
    registerListeners();

    if (DISPATCHERS.has(el)) {
        return DISPATCHERS.get(el).events$;
    }

    const dispatch = dispatcher(config);
    DISPATCHERS.set(el, dispatch);
    return dispatch.events$;
}
