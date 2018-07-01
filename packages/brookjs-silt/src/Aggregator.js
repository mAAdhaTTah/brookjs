import React from 'react';
import Kefir from 'kefir';
import PropTypes from 'prop-types';
import { Provider } from './context';
import h from './h';

export default class Aggregator extends React.Component {
    constructor (props) {
        super(props);

        this.action$ = Kefir.pool();
    }

    componentDidMount() {
        this.sub = this.props.action$(this.action$);
    }

    componentWillUnmount() {
        this.sub && this.sub.unsubscribe();
    }

    render() {
        return (
            <Provider value={this.action$}>
                {this.props.children}
            </Provider>
        );
    }
}

Aggregator.propTypes = {
    children: PropTypes.element.isRequired,
    action$: PropTypes.func.isRequired
};
