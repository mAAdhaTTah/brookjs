import { Kefir } from 'brookjs';
import PropTypes from 'prop-types';
import { Component } from 'react';

export default class Reffable extends Component {
    constructor (props, context) {
        super(props, context);

        this.children = null;
        this.streams = [];
        this.reffed$ = Kefir.pool();
        this.didMount$ = new Kefir.Stream();
        this.didUpdate$ = new Kefir.Stream();
    }

    componentDidMount() {
        this.didMount$._emitValue(Date.now());
    }

    componentDidUpdate() {
        this.didUpdate$._emitValue(Date.now());
    }

    componentWillUnmount() {
        this.clearStreams();
        this.context.aggregated$.unplug(this.reffed$);
    }

    render() {
        if (!this.children) {
            this.renderChildren(this.props);
            this.context.aggregated$.plug(this.reffed$);
        }

        return this.children;
    }

    componentWillReceiveProps(props) {
        this.clearStreams();
        this.renderChildren(props);
    }

    clearStreams () {
        this.streams.forEach(ref$ => this.reffed$.unplug(ref$));
        this.streams = [];
    }

    renderChildren ({ children, callback }) {
        this.children = {
            ...children,
            ref: el =>  {
                if (el) {
                    const ref$ = callback(el, {
                        didMount$: this.didMount$,
                        didUpdate$: this.didUpdate$
                    });

                    this.reffed$.plug(ref$);
                    this.streams.push(ref$);
                }
            }
        };
    }
}

Reffable.propTypes = {
    callback: PropTypes.func,
    children: PropTypes.element
};

Reffable.contextTypes = {
    aggregated$: PropTypes.instanceOf(Kefir.Observable).isRequired
};
