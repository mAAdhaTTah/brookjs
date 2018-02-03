import { Kefir } from 'brookjs';
import PropTypes from 'prop-types';
import { Children, Component } from 'react';
import h from './h';
import { isString, isObs, EMIT_PROP } from './helpers';

const $$original = Symbol('@@brookjs-silt/original');

const createRendered = ({ type, props, children, events, stream$ }, streams) => {
    for (const event of events) {
        const callback = props[event];

        // @todo this can probably be done better
        // caching functions across renders
        if (callback[$$original]) {
            break;
        }

        const event$ = new Kefir.Stream();
        const callbacked$ = callback(event$);

        streams.push(callbacked$);
        const push = props[event] = e => event$._emitValue(e);
        push[$$original] = callback;
        stream$.plug(callbacked$);
    }

    return h(type, props, ...(children || []));
};

class WithObservableEvents extends Component {
    constructor (props, context) {
        super(props, context);

        this.rendered = null;
        this.streams = [];
    }

    componentWillReceiveProps(props) {
        this.componentWillUnmount();
        this.rendered = createRendered(props, this.streams);
    }

    componentWillUnmount() {
        this.streams.forEach(stream$ => stream$._emitEnd());
        this.streams = [];
    }

    render() {
        if (!this.rendered) {
            this.rendered = createRendered(this.props, this.streams);
        }

        return this.rendered;
    }
}

const isStateless = Component => !Component.prototype.render;

const types = new Map();

// @todo this feels like making a bad problem worse...
const getTypeForComponent = (Component, stream$) => {
    if (types.has(Component)) {
        return types.get(Component);
    }

    let type;

    if (isStateless(Component)) {
        type = props => walkChildren(h(Component, props), stream$); // eslint-disable-line no-use-before-define
    } else {
        type = class FromClass extends Component {

            render() {
                return walkChildren(super.render(), stream$); // eslint-disable-line no-use-before-define
            }
        };
    }

    types.set(Component, type);

    return type;
}

const walkChildren = (children, stream$) => {
    if (isObs(children)) {
        return children.map(element => walkChildren(element, stream$));
    }

    return Children.map(children, child => {
        if (!child || typeof child !== 'object') {
            return child;
        }

        if (isObs(child)) {
            return child.map(element => walkChildren(element, stream$));
        }

        const events = [];
        let { props, type } = child;
        let { children, ...rest } = props || {};
        props = rest;

        if (isString(type) || props[EMIT_PROP]) {
            if (isString(type) && children) {
                children = walkChildren(children, stream$);
            } else if (props[EMIT_PROP]) {
                type = getTypeForComponent(type, stream$);
            }

            for (const prop in props) {
                if (prop.startsWith('on') && typeof props[prop] === 'function') {
                    events.push(prop);
                }
            }

            if (events.length) {
                return h(
                    WithObservableEvents,
                    { type, props, children, events, stream$ }
                );
            }
        }

        return h(type, props, children);
    });
};

export default class Collector extends Component {
    constructor (props, context) {
        super(props, context);

        this.children = null;
        this.stream$ = null;
    }

    componentWillMount () {
        this.children = walkChildren(this.props.children, this.stream$ = Kefir.pool());
        this.context.aggregated$.plug(this.stream$);
    }

    componentWillReceiveProps(props) {
        this.componentWillUnmount();
        this.children = walkChildren(props.children, this.stream$ = Kefir.pool());
        this.context.aggregated$.plug(this.stream$);
    }

    componentWillUnmount() {
        this.context.aggregated$.unplug(this.stream$);
    }

    render () {
        return this.children;
    }
}

Collector.contextTypes = {
    aggregated$: PropTypes.instanceOf(Kefir.Observable).isRequired
};
