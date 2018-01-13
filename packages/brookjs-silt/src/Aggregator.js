import { Component } from 'react';
import { Kefir } from 'brookjs';
import PropTypes from 'prop-types';

export default class Aggregator extends Component {
    constructor (props, context) {
        super(props, context);

        this.actions$ = Kefir.pool();
    }

    getChildContext() {
        return {
            aggregated$: this.actions$
        };
    }

    componentDidMount() {
        this.sub = this.props.action$(this.actions$);
    }

    componentWillUnmount() {
        this.sub && this.sub.unsubscribe();
    }

    render() {
        return this.props.children;
    }
}

Aggregator.childContextTypes = {
    aggregated$: PropTypes.instanceOf(Kefir.Observable)
};

Aggregator.propTypes = {
    children: PropTypes.element.isRequired,
    action$: PropTypes.func.isRequired
};
