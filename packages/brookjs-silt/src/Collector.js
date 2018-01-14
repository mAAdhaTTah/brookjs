import { Kefir } from 'brookjs';
import PropTypes from 'prop-types';
import { Children, Component, createElement } from 'react';

const isString = is => typeof is === 'string'; // @todo dedupe from h

const createRendered = ({ type, props, children, events, stream$ }, streams) => {
    for (const event of events) {
        const event$ = new Kefir.Stream();
        const callback = props[event];
        const callbacked$ = callback(event$);

        streams.push(callbacked$);
        props[event] = e => event$._emitValue(e);
        stream$.plug(callbacked$);
    }

    return createElement(type, props, ...children);
};

class WithObservableEvents extends Component {
    constructor (props, context) {
        super(props, context);

        this.rendered = null;
        this.streams = [];
    }

    componentWillMount() {
        this.rendered = createRendered(this.props, this.streams);
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
        return this.rendered;
    }
}

const walkChildren = (children, stream$) => {
    return Children.map(children, (child) => {
        if (!child || typeof child !== 'object') {
            return child;
        }

        const events = [];
        let { props, type } = child;
        let { children, ...rest } = props || {};
        props = rest;

        if (children) {
            children = walkChildren(children, stream$);
        }

        for (const prop in props) {
            if (prop.startsWith('on') && typeof props[prop] === 'function') {
                events.push(prop);
            }
        }

        if (events.length && isString(type)) {
            return createElement(
                WithObservableEvents,
                { type, props, children, events, stream$ }
            );
        }

        return createElement(type, props, children);
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
