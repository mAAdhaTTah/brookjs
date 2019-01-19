import React from 'react';
import { createRef, forwardRef, getRef } from 'create-react-ref';
// eslint-disable-next-line import/no-internal-modules
import wrapDisplayName from 'recompose/wrapDisplayName';
import Kefir from 'kefir';
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

                        if (!this.plugged$) {
                            this.plugged$ = callback(this.ref$, this.props);
                        }

                        this.aggregated$ = aggregated$.plug(this.plugged$);

                        return <Reffed {...this.props} ref={this.ref} />;
                    }}
                </Consumer>
            );
        }
    }

    WithRef.displayName = wrapDisplayName(Reffed, 'WithRef');

    return WithRef;
};
