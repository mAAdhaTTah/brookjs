import { Kefir } from 'brookjs';
import PropTypes from 'prop-types';
import { Component } from 'react';
import { isString, isObs, EMIT_PROP } from './helpers';

export default class Collector extends Component {
    constructor (props, context) {
        super(props, context);

        this.children = null;
        this.streams = [];
        this.collected$ = Kefir.pool();
    }

    renderChildren (props) {
        this.children = this.walkChildren(props.children);
    }

    walkChildren(child) {
        if (Array.isArray(child) || isObs(child)) {
            return child.map(child => this.walkChildren(child));
        }

        if (!child || typeof child !== 'object') {
            return child;
        }

        if (isObs(child)) {
            return child.map(child => this.walkChildren(child));
        }

        let { props, type } = child;
        let { children, ...rest } = props || {};
        props = rest;

        if (isString(type) || props[EMIT_PROP]) {
            if (children) {
                children = this.walkChildren(children);
            }

            for (const prop in props) {
                if (prop.startsWith('on') && typeof props[prop] === 'function') {
                    const callback = props[prop];
                    const event$ = new Kefir.Stream();
                    this.streams.push(event$);

                    props = {
                        ...props,
                        [prop]: e => event$._emitValue(e)
                    };

                    this.collected$.plug(callback(event$));
                }
            }
        }

        return { ...child, props: { ...props, children } };
    }


    componentWillReceiveProps(props) {
        this.clearStreams();
        this.renderChildren(props);
    }

    componentWillUnmount() {
        this.clearStreams();
        this.context.aggregated$.unplug(this.collected$);
    }

    clearStreams () {
        this.streams.forEach(stream => stream._emitEnd());
        this.streams = [];
    }

    render () {
        if (!this.children) {
            this.renderChildren(this.props);
            this.context.aggregated$.plug(this.collected$);
        }

        return this.children;
    }
}

Collector.propTypes = {
    children: PropTypes.element.isRequired
};

Collector.contextTypes = {
    aggregated$: PropTypes.instanceOf(Kefir.Observable).isRequired
};
