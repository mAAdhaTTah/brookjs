import { Kefir } from 'brookjs';
import { Component, h, render } from 'ink';

class Root extends Component {
    componentDidMount () {
        const { props$ } = this.props;

        this.sub = props$.observe(val => {
            this.setState(val);
        });
    }

    componentWillUnmount () {
        this.sub && this.sub.unsubscribe();
    }

    render ({ emitter, View }, state) {
        return <View emitter={emitter} {...state} />;
    }
}

export default (View, props$) => Kefir.stream(emitter =>
    render(<Root props$={props$} View={View} emitter={emitter} />)
);
