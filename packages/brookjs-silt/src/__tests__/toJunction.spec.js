/* eslint-env mocha */
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { expect, use } from 'chai';
import Kefir from 'kefir';
import { chaiPlugin } from 'brookjs-desalinate';
import sinon from 'sinon';
import h from '../h';
import toJunction from '../toJunction';
import { Provider } from '../context';

const { plugin, value, stream, send } = chaiPlugin({ Kefir });

configure({ adapter: new Adapter() });
use(plugin);

describe('toJunction', () => {
    const events = { onButtonClick: e$ => e$.map(() => ({ type: 'CLICK' })) };

    const Button = toJunction(({ onButtonClick, text, enabled }) => (
        enabled ? <button onClick={onButtonClick}>
            {text}
        </button> : <span>nothing to click</span>
    ), { events });

    const ProvidedButton = ({ aggregator$, text, enabled }) => (
        <Provider value={aggregator$}>
            <Button text={text} enabled={enabled} />
        </Provider>
    );

    const clickButton = wrapper => wrapper.find('button').simulate('click');

    it('should render normally', () => {
        const aggregator$ = Kefir.pool();
        const wrapper = mount(
            <ProvidedButton aggregator$={aggregator$} text={'Click me'} enabled={true} />
        );

        expect(wrapper.html()).to.equal('<button>Click me</button>');
    });

    it('should update normally', () => {
        const aggregator$ = Kefir.pool();
        const wrapper = mount(
            <ProvidedButton aggregator$={aggregator$} text={'Click me'} enabled={true} />
        );

        wrapper.setProps({ text: 'Click me', enabled: false });

        expect(wrapper.html()).to.equal('<span>nothing to click</span>');
    });

    it('should emit events through aggregated stream', () => {
        const aggregator$ = Kefir.pool();
        const wrapper = mount(
            <ProvidedButton aggregator$={aggregator$} text={'Click me'} enabled={true} />
        );

        expect(aggregator$).to.emit([value({ type: 'CLICK' })], () => {
            clickButton(wrapper);
        });
    });

    it('should emit one event after updating', () => {
        const aggregator$ = Kefir.pool();
        const wrapper = mount(
            <ProvidedButton aggregator$={aggregator$} text={'Click me'} enabled={true} />
        );

        wrapper.setProps({ text: 'Click you', enabled: true });

        expect(aggregator$).to.emit([value({ type: 'CLICK' })], () => {
            clickButton(wrapper);
        });
    });

    it('should unplug if unmounted', () => {
        const aggregator$ = Kefir.pool();
        const wrapper = mount(
            <ProvidedButton aggregator$={aggregator$} text={'Click me'} enabled={true} />
        );

        wrapper.unmount();

        expect(aggregator$._curSources).to.have.lengthOf(0);
    });

    it('should unplug from old stream if new stream provided', () => {
        const aggregator$ = Kefir.pool();
        const wrapper = mount(
            <ProvidedButton aggregator$={aggregator$} text={'Click me'} enabled={true} />
        );

        const newAggregated$ = Kefir.pool();

        wrapper.setProps({ aggregator$: newAggregated$ });
        expect(aggregator$._curSources).to.have.lengthOf(0);
        expect(newAggregated$._curSources).to.have.lengthOf(1);
    });

    it('should call combine with correct arguments and use returned stream', () => {
        const source$ = stream();
        const combine = sinon.spy(() => source$);
        const Button = toJunction(({ onButtonClick, text, enabled }) => (
            enabled ? <button onClick={onButtonClick}>
                {text}
            </button> : <span>nothing to click</span>
        ), { combine, events });

        const ProvidedButton = ({ aggregator$, text, enabled }) => (
            <Provider value={aggregator$}>
                <Button text={text} enabled={enabled} />
            </Provider>
        );
        const aggregator$ = Kefir.pool();
        mount(
            <ProvidedButton aggregator$={aggregator$} text={'Click me'} enabled={true} />
        );

        expect(aggregator$).to.emit([value({ type: 'EMITTED' })], () => {
            send(source$, [value({ type: 'EMITTED' })]);
        });
    });
});
