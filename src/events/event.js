const ALL_PROPS = [
    'altKey', 'bubbles', 'cancelable', 'ctrlKey',
    'eventPhase', 'metaKey', 'relatedTarget', 'shiftKey',
    'target', 'timeStamp', 'type', 'view', 'which'
];
const KEY_PROPS = ['char', 'charCode', 'key', 'keyCode'];
const MOUSE_PROPS = [
    'button', 'buttons', 'clientX', 'clientY', 'layerX',
    'layerY', 'offsetX', 'offsetY', 'pageX', 'pageY',
    'screenX', 'screenY', 'toElement'
];

const rkeyEvent = /^key|input/;
const rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/;

const $$event = Symbol('event');
const $$decorated = Symbol('decorated');
const $$container = Symbol('container');

class ProxyEvent {
    constructor(event, decorated, container) {
        for (let i = 0; i < ALL_PROPS.length; i++) {
            const propKey = ALL_PROPS[i];
            this[propKey] = event[propKey];
        }

        this[$$event] = event;
        this[$$decorated] = decorated;
        this[$$container] = container;
    }

    get decoratedTarget() {
        return this[$$decorated];
    }

    get containerTarget() {
        return this[$$container];
    }

    get defaultPrevented() {
        return this[$$event].defaultPrevented;
    }

    preventDefault() {
        return this[$$event].preventDefault();
    }
}

class  MouseEvent extends ProxyEvent {
    constructor(event, decorated, container) {
        super(event, decorated, container);

        for (let i = 0; i < MOUSE_PROPS.length; i++) {
            const mousePropKey = MOUSE_PROPS[i];
            this[mousePropKey] = event[mousePropKey];
        }
    }
}

class KeyEvent extends ProxyEvent {
    constructor(event, decorated, container) {
        super(event, decorated, container);

        for (let i = 0; i < KEY_PROPS.length; i++) {
            const keyPropKey = KEY_PROPS[i];
            this[keyPropKey] = event[keyPropKey];
        }
    }
}

export function create(event, decorated, container) {
    if (rkeyEvent.test(event.type)) {
        return new KeyEvent(event, decorated, container);
    }

    if (rmouseEvent.test(event.type)) {
        return new MouseEvent(event, decorated, container);
    }

    return new ProxyEvent(event, decorated, container);
}
