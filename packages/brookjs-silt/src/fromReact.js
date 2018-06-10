import ReactDOM from 'react-dom';
import { Kefir, component } from 'brookjs';
import h from './h';
import Aggregator from './Aggregator';

/**
 * Convert React component to old-style brookjs component.
 *
 * @param  {React.Component|function} Component - React component to wrap.
 * @returns{Component} brookjs component.
 * @deprecated
 */
export default function withReact(Component) {
    return component({
        onMount: (el, stream$) => Kefir.stream(emitter => {
            ReactDOM.render(
                <Aggregator action$={action$ => action$.observe(emitter)}>
                    <Component stream$={stream$} />
                </Aggregator>,
                el
            );

            return () => ReactDOM.unmountComponentAtNode(el);
        })
    });
}
