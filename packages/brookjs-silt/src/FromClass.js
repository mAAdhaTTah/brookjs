import { Component } from 'react';
import { isObs, forEachInChildrenArray, render, CHILDREN, STYLE, VALUE, ERROR } from './helpers';

const emptyArr = [];

const incValues = self => {
    self.values += 1;
};

const doSubscribe = (self, props) => {
    self.at = 0;
    self.doSubscribe(props);
    self.at = 1;
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

export default class FromClass extends LiftedComponent {
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
