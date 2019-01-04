import React from 'react';
import Kefir from 'kefir';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-internal-modules
import wrapDisplayName from 'recompose/wrapDisplayName';
import h from './h';
import { Consumer, Provider } from './context';

const id = x => x;

const toJunction = (events = {}) => WrappedComponent => {
    let combine = id;

    if (events.events) {
        ({ events = {}, combine = id } = events);
    }

    class ToJunction extends React.Component {
        static defaultProps = {
            preplug: x => x
        }

        static propTypes = {
            preplug: PropTypes.func
        }

        constructor(props, context) {
            super(props, context);
            this.root$ = null;
            this.events = {};

            this.children$ = Kefir.pool();

            this.sources = {
                list: [this.children$],
                dict: { children$: this.children$ },
                merged: null
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
            return this.props.preplug(combine(
                this.sources.merged,
                this.sources.dict,
                this.props
            ));
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

                        return (
                            <Provider value={this.children$}>
                                <WrappedComponent {...this.events} {...this.props} />
                            </Provider>
                        );
                    }}
                </Consumer>
            );
        }
    }

    ToJunction.displayName = wrapDisplayName(WrappedComponent, 'ToJunction');

    return ToJunction;
};

export default toJunction;
