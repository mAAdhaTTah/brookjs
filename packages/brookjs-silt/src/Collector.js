import Kefir from 'kefir';
import PropTypes from 'prop-types';
import React from 'react';
import { Consumer, Provider } from './context';
import h from './h';
import { isString, isObs, EMIT_PROP } from './helpers';

export default class Collector extends React.Component {
    constructor (props) {
        super(props);

        this.children = null;
        this.streams = [];
        this.collected$ = Kefir.pool();
        this.provided$ = Kefir.pool();
    }

    renderChildren (props) {
        this.children = this.walkChildren(props.children);
    }

    walkChildren(child) {
        if (Array.isArray(child)) {
            return child.map(child => this.walkChildren(child));
        }

        if (!child || typeof child !== 'object') {
            return child;
        }

        if (isObs(child)) {
            return child.map(child => this.walkChildren(child));
        }

        let { props, type, ...other } = child;
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

        return { ...child, ...other, props: { ...props, children } };
    }


    componentWillReceiveProps(props) {
        this.clearStreams();
        this.renderChildren(props);
    }

    componentWillUnmount() {
        this.clearStreams();
        this.aggregated$.unplug(this.collected$).unplug(this.preplugged$);
    }

    clearStreams () {
        this.streams.forEach(stream => stream._emitEnd());
        this.streams = [];
    }

    render () {
        if (!this.children) {
            this.renderChildren(this.props);
        }

        if (!this.preplugged$) {
            this.preplugged$ = this.props.preplug(this.provided$);
        }

        return (
            <Consumer>
                {aggregated$ => {
                    this.aggregated$ = aggregated$
                        .plug(this.collected$)
                        .plug(this.preplugged$);

                    return (
                        <Provider value={this.provided$}>
                            {this.children}
                        </Provider>
                    );
                }}
            </Consumer>
        );
    }
}

Collector.propTypes = {
    children: PropTypes.element.isRequired,
    preplug: PropTypes.func
};

Collector.defaultProps = {
    preplug: x => x
};
