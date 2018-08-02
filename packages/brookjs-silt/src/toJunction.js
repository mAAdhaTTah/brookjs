import React from 'react';
import Kefir from 'kefir';
import wrapDisplayName from 'recompose/wrapDisplayName';
import h from './h';
import { Consumer } from './context';

export default function toJunction(Component, { events, combine = x => x }) {
    class ToJunction extends React.Component {
        constructor(props, context) {
            super(props, context);
            this.aggregator$ = null;
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
                this.sources.dicts,
                this.props
            );
        }

        unplug() {
            this.aggregator$ && this.aggregator$.unplug(this.source$);
        }

        componentWillUnmount() {
            this.unplug();
        }

        componentDidUpdate() {
            this.unplug();
            this.aggregator$.plug(
                this.source$ = this.createSource()
            );
        }

        render() {
            return (
                <Consumer>
                    {aggregator$ => {
                        if (this.aggregator$ !== aggregator$) {
                            this.unplug();
                            this.aggregator$ = aggregator$.plug(this.source$);
                        }

                        return <Component {...this.props} {...this.events} />;
                    }}
                </Consumer>
            );
        }
    }

    ToJunction.displayName = wrapDisplayName(Component, 'ToJunction');

    return ToJunction;
}
