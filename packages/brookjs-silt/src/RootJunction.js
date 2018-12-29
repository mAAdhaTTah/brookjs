import React from 'react';
import Kefir from 'kefir';
import PropTypes from 'prop-types';
import { Provider } from './context';
import h from './h';

export default class RootJunction extends React.Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
        root$: PropTypes.func.isRequired
    }

    constructor (props) {
        super(props);

        this.root$ = Kefir.pool();
    }

    componentDidMount() {
        this.sub = this.props.root$(this.root$);
    }

    componentWillUnmount() {
        this.sub && this.sub.unsubscribe();
    }

    render() {
        return (
            <Provider value={this.root$}>
                {this.props.children}
            </Provider>
        );
    }
}
