import { createElement, Component } from 'react';
import { isObs, isString } from './helpers';

const emptyObj = {};
const emptyArr = [];

const VALUE = 'value';
const ERROR = 'error';

// These are handled custom.
const TYPE = '$$type';
const DD_REF = '$$ref';
const CHILDREN = 'children';
const REF = 'ref';
const STYLE = 'style';
const PROP = 'silt-embeddable';

const doSubscribe = (self, props) => {
    self.at = 0;
    self.doSubscribe(props);
    self.at = 1;
};

const hasObsInChildrenArray = children => {
    for (let i = 0; i < children.length; ++i) {
        const child = children[i];
        if (isObs(child) || Array.isArray(child) && hasObsInChildrenArray(child)) {
            return true;
        }
    }
    return false;
};

const hasObsInProps = props => {
    for (const key in props) {
        const val = props[key];
        if (isObs(val)) {
            return true;
        } else if (CHILDREN === key) {
            if (Array.isArray(val) && hasObsInChildrenArray(val)) {
                return true;
            }
        } else if (STYLE === key) {
            for (const k in val) {
                if (isObs(val[k])) {
                    return true;
                }
            }
        }
    }
    return false;
};

const forEachInChildrenArray = (children, extra, fn) => {
    for (let i = 0, n = children.length; i < n; ++i) {
        const childI = children[i];
        if (isObs(childI)) {
            fn(extra, childI);
        } else if (Array.isArray(childI)) {
            forEachInChildrenArray(childI, extra, fn);
        }
    }
};

const forEachInProps = (props, arg, fn) => {
    for (const key in props) {
        const val = props[key];
        if (isObs(val)) {
            fn(arg, val);
        } else if (CHILDREN === key) {
            if (Array.isArray(val)) {
                forEachInChildrenArray(val, arg, fn);
            }
        } else if (STYLE === key) {
            for (const k in val) {
                const valK = val[k];
                if (isObs(valK)) {
                    fn(arg, valK);
                }
            }
        }
    }
};

const filterProps = (type, props) => {
    // Throw away PROP, migrate ref.
    const { [PROP]: _, [REF]: ref, ...rest } = props; // eslint-disable-line no-unused-vars
    return { ...rest, [DD_REF]: ref, [TYPE]: type };
};

const incValues = self => {
    self.values += 1;
};

const offAny1 = (handlers, obs) => {
    obs.offAny(handlers);
};

const offAny = (handlers, obs) => {
    const handler = handlers.pop();
    if (handler) {
        obs.offAny(handler);
    }
};
const onAny1 = (handlers, obs) => {
    obs.onAny(handlers);
};

const renderChildren = (children, self, values) => {
    if (isObs(children)) {
        return values[self.at++];
    }

    if (Array.isArray(children)) {
        let newChildren = children;

        for (let i = 0, n = children.length; i < n; ++i) {
            const childI = children[i];
            let newChildI = childI;

            if (isObs(childI)) {
                newChildI = values[self.at++];
            } else if (Array.isArray(childI)) {
                newChildI = renderChildren(childI, self, values);
            }

            if (newChildI !== childI) {
                if (newChildren === children) {
                    newChildren = children.slice(0);
                }

                newChildren[i] = newChildI;
            }
        }

        return newChildren;
    }

    return children;
};

const renderStyle = (style, self, values) => {
    let newStyle = null;
    for (const i in style) {
        const styleI = style[i];
        if (isObs(styleI)) {
            if (!newStyle) {
                newStyle = {};
                for (const j in style) {
                    if (j === i) {
                        break;
                    }
                    newStyle[j] = style[j];
                }
            }
            newStyle[i] = values[self.at++];
        } else if (newStyle) {
            newStyle[i] = styleI;
        }
    }
    return newStyle || style;
};

const render = (self, values) => {
    const props = self.props;

    let type = null;
    let newProps = null;
    let newChildren = null;

    self.at = 0;

    for (const key in props) {
        const val = props[key];
        if (CHILDREN === key) {
            newChildren = renderChildren(val, self, values);
        } else if (TYPE === key) {
            type = props[key];
        } else if (DD_REF === key) {
            newProps = newProps || {};
            newProps.ref = isObs(val) ? values[self.at++] : val;
        } else if (isObs(val)) {
            newProps = newProps || {};
            newProps[key] = values[self.at++];
        } else if (STYLE === key) {
            newProps = newProps || {};
            newProps.style = renderStyle(val, self, values);
        } else {
            newProps = newProps || {};
            newProps[key] = val;
        }
    }

    return newChildren instanceof Array
        ? createElement.apply(null, [type, newProps, ...newChildren])
        : null !== newChildren
            ? createElement(type, newProps, newChildren)
            : createElement(type, newProps);
};

const onAny = (self, obs) => {
    const handler = e => {
        const handlers = self.handlers;
        let idx = 0;
        while (handlers[idx] !== handler) {
            ++idx;
        }
        switch (e.type) {
            case VALUE: {
                const value = e.value;
                const values = self.values;
                if (values[idx] !== value) {
                    values[idx] = value;
                    if (self.at !== 0) {
                        self.forceUpdate();
                    }
                }
                break;
            }
            case ERROR: throw e.value;
            default: {
                handlers[idx] = null;
                const n = handlers.length;
                if (n !== self.values.length) {
                    return;
                }
                for (let i = 0; i < n; ++i) {
                    if (handlers[i]) {
                        return;
                    }
                }
                self.handlers = null;
            }
        }
    };
    self.handlers.push(handler);
    obs.onAny(handler);
};

class LiftedComponent extends Component {
    constructor (props, context) {
        super(props, context);

        this.at = 0;
    }

    componentWillReceiveProps(nextProps) {
        this.componentWillUnmount();
        doSubscribe(this, nextProps);
    }

    componentWillMount() {
        doSubscribe(this, this.props);
    }
}

class FromClass extends LiftedComponent {
    constructor (props, context) {
        super(props, context);

        this.values = this;
        this.handlers = null;
    }

    componentWillUnmount() {
        const handlers = this.handlers;
        if (handlers instanceof Function) {
            forEachInProps(this.props, handlers, offAny1);
        } else if (handlers) {
            forEachInProps(this.props, handlers.reverse(), offAny);
        }
    }

    doSubscribe(props) {
        this.values = 0;
        forEachInProps(props, this, incValues);
        const n = this.values;

        switch (n) {
            case 0:
                this.values = emptyArr;
                break;
            case 1: {
                this.values = this;
                forEachInProps(props, this.handlers = e => {
                    switch (e.type) {
                        case VALUE: {
                            const value = e.value;
                            if (this.values !== value) {
                                this.values = value;
                                if (this.at) {
                                    this.forceUpdate();
                                }
                            }
                            break;
                        }
                        case ERROR: throw e.value;
                        default: {
                            this.values = [this.values];
                            this.handlers = null;
                        }
                    }
                }, onAny1);
                break;
            }
            default:
                this.values = Array(n).fill(this);
                this.handlers = [];
                forEachInProps(props, this, onAny);
        }
    }

    render() {
        if (this.handlers instanceof Function) {
            const value = this.values;
            if (value === this) {
                return null;
            }
            return render(this, [value]);
        } else {
            const values = this.values;
            for (let i = 0, n = values.length; i < n; ++i) {
                if (values[i] === this) {
                    return null;
                }
            }
            return render(this, values);
        }
    }
}

const h = (type, props, ...children) => {
    // can be null with no props
    props = props || emptyObj;

    if (isString(type) || props[PROP]) {
        if (hasObsInChildrenArray(children) || hasObsInProps(props)) {
            props = filterProps(type, props);
            type = FromClass;
        } else if (props[PROP]) {
            props = filterProps(type, props);
        }
    }
    return createElement(type, props, ...children);
};

export default h;
