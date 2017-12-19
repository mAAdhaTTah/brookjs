import { Kefir, ofType } from 'brookjs';
import { h, Component, render } from 'ink';
import { RUN } from '../../actions';
import log from './log';
import CommandNotFound from './CommandNotFound';
import devCommand from './devCommand';
import newCommandPrompt from './newCommandPrompt';

class Root extends Component {
    componentDidMount() {
        const { props$ } = this.props;

        this.sub = props$.observe(val => {
            this.setState(val);
        });
    }

    componentWillUnmount() {
        this.sub && this.sub.unsubscribe();
    }

    render({ emitter, View }) {
        return <View emitter={emitter} {...this.state} />;
    }
}

const mountTerminal = (View, props$) => Kefir.stream(emitter =>
    render(<Root props$={props$} View={View} emitter={emitter}/>)
);

export default (services) => (actions$, state$) =>
    Kefir.merge([
        log(services, actions$, state$),
        state$.sampledBy(actions$.thru(ofType(RUN))).take(1).flatMap(state => {
            switch (state.command.name) {
                case 'new':
                    return newCommandPrompt(services, actions$, state$);
                case 'dev':
                    return devCommand(services, actions$, state$);
                case 'make':
                case 'test':
                case 'build':
                    return Kefir.never();
                default:
                    return mountTerminal(CommandNotFound, state$);
            }
        })
    ]);
