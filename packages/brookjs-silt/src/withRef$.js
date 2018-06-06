import { forwardRef } from 'react';
import Kefir from 'kefir';
import h from './h';
import { Consumer } from './context';

const getDisplayName = Component =>
    Component.displayName || Component.name || 'Component';

export default function withRef$(c, callback) {
    const Component = forwardRef(c);
    const WithRef = props => {
        const ref$ = new Kefir.Property();

        return (
            <Consumer>
                {aggregated$ => {
                    aggregated$.plug(callback(ref$, props));

                    return <Component {...props} ref={el => el && ref$._emitValue(el)} />;
                }}
            </Consumer>
        );
    };

    WithRef.displayName = `WithRef(${getDisplayName(Component)})`;

    return WithRef;
};
