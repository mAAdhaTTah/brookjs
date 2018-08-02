import React from 'react';
import { createRef, forwardRef, getRef } from 'create-react-ref';
import wrapDisplayName from 'recompose/wrapDisplayName';
import Kefir from 'kefir';
import h from './h';
import { Consumer } from './context';

export default function withRef$(c, callback) {
    const Reffed = forwardRef(c);

    class WithRef extends React.Component {
        constructor(props, context) {
            super(props, context);
            this.ref$ = new Kefir.Property();
            this.ref = createRef();
            this.el = null;
        }

        componentWillUnmount() {
            this.aggregated$.unplug(this.plugged$);
        }

        componentDidMount() {
            const el = getRef(this.ref);

            if (el && this.el !== el) {
                this.ref$._emitValue(el);
                this.el = el;
            }
        }

        render() {
            return (
                <Consumer>
                    {aggregated$ => {
                        if (this.plugged$) {
                            this.aggregated$.unplug(this.plugged$);
                        }

                        this.aggregated$ = aggregated$;

                        if (!this.plugged$) {
                            aggregated$.plug(
                                this.plugged$ = callback(this.ref$, this.props)
                            );
                        }

                        return <Reffed {...this.props} ref={this.ref} />;
                    }}
                </Consumer>
            );
        }
    }

    WithRef.displayName = wrapDisplayName(Reffed, 'WithRef');

    return WithRef;
};
