import React from 'react';
import Kefir from 'kefir';
// eslint-disable-next-line import/no-internal-modules
import wrapDisplayName from 'recompose/wrapDisplayName';
import h from './h';
import { Consumer } from './context';

const toJunction = ({ events, combine = x => x }) => WrappedComponent => {
    class ToJunction extends React.Component {
        constructor(props, context) {
            super(props, context);
            this.root$ = null;
            this.events = {};

            this.sources = {
                list: [],
                dict: {}
            };

            for (const key in events) {
                const e$ = new Kefir.Stream();
                this.events[key] = e => e$._emitValue(e);
                this.sources.list.push(this.sources.dict[key + '$'] = events[key](e$));
            }

            this.sources.merged = Kefir.merge(this.sources.list);
            this.source$ = this.createSource();
        }

        createSource() {
            return combine(
                this.sources.merged,
                this.sources.dict,
                this.props
            );
        }

        unplug() {
            this.root$ && this.root$.unplug(this.source$);
        }

        componentWillUnmount() {
            this.unplug();
        }

        componentDidUpdate() {
            this.unplug();
            this.root$.plug(
                this.source$ = this.createSource()
            );
        }

        render() {
            return (
                <Consumer>
                    {root$ => {
                        if (this.root$ !== root$) {
                            this.unplug();
                            this.root$ = root$.plug(this.source$);
                        }

                        return <WrappedComponent {...this.events} {...this.props} />;
                    }}
                </Consumer>
            );
        }
    }

    ToJunction.displayName = wrapDisplayName(WrappedComponent, 'ToJunction');

    return ToJunction;
};

export default toJunction;
