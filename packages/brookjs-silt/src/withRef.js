import React from 'react';
import { createRef, forwardRef, getRef } from 'create-react-ref';
// eslint-disable-next-line import/no-internal-modules
import wrapDisplayName from 'recompose/wrapDisplayName';
import Kefir from 'kefir';
import { Consumer } from './context';

const wrap = WrappedComponent => {
    // Ref-forward function has 2 params.
    if (WrappedComponent.length === 2) {
        return forwardRef(WrappedComponent);
    }

    return WrappedComponent;
};

const withRef$ = refback => WrappedComponent =>
    class WithRef$ extends React.Component {
        static displayName = wrapDisplayName(WrappedComponent, 'WithRef$');

        static Target = wrap(WrappedComponent);

        ref = createRef();

        props$ = new Kefir.Stream()
            .toProperty(() => this.props)
            .setName(`${WithRef$.displayName}#props$`);

        ref$ = new Kefir.Stream()
            .toProperty(() => getRef(this.ref))
            .setName(`${WithRef$.displayName}#ref$`);

        componentWillUnmount() {
            this.aggregated$.unplug(this.plugged$);
        }

        componentDidMount() {
            const el = getRef(this.ref);

            if (el) {
                this.ref$._emitValue(el);
            }
        }

        componentDidUpdate() {
            this.emitProps();
        }

        emitProps() {
            this.props$._emitValue(this.props);
        }

        render() {
            return (
                <Consumer>
                    {aggregated$ => {
                        if (this.plugged$ && this.aggregated$ !== aggregated$) {
                            this.aggregated$.unplug(this.plugged$);
                            this.aggregated$ = aggregated$.plug(this.plugged$);
                        }

                        if (!this.plugged$) {
                            this.plugged$ = refback(this.ref$, this.props$);
                            this.aggregated$ = aggregated$.plug(this.plugged$);
                        }

                        return <WithRef$.Target {...this.props} ref={this.ref} />;
                    }}
                </Consumer>
            );
        }
    };

export default withRef$;
