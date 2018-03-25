/* eslint-env mocha */
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { expect, use } from 'chai';
import { Kefir } from 'brookjs';
import { chaiPlugin } from 'brookjs-desalinate';
import h from '../h';
import Collector from '../Collector';
import { Provider } from '../context';

const { plugin, value } = chaiPlugin({ Kefir });

configure({ adapter: new Adapter() });
use(plugin);

describe('Collector', () => {

    const CollectedButton = ({ text, enabled, aggregated$ }) => (
        <Provider value={aggregated$}>
            <Collector>
                {enabled ?
                    <button onClick={e$ => e$.map(() => ({ type: 'CLICK' }))}>
                        {text}
                    </button> :
                    <span>nothing to click</span>}
            </Collector>
        </Provider>
    );

    it('should render children normally', () => {
        const aggregated$ = Kefir.pool();
        const wrapper = mount(
            <CollectedButton aggregated$={aggregated$} text={'Click me'} enabled={true} />
        );

        expect(wrapper.html()).to.equal('<button>Click me</button>');
    });

    it('should update children normally', () => {
        const aggregated$ = Kefir.pool();
        const wrapper = mount(
            <CollectedButton aggregated$={aggregated$} text={'Click me'} enabled={true} />
        );

        wrapper.setProps({ text: 'Click me', enabled: false });

        expect(wrapper.html()).to.equal('<span>nothing to click</span>');
    });

    it('should emit events through aggregated stream', () => {
        const aggregated$ = Kefir.pool();
        const wrapper = mount(
            <CollectedButton aggregated$={aggregated$} text={'Click me'} enabled={true} />
        );

        expect(aggregated$).to.emit([value({ type: 'CLICK' })], () => {
            wrapper.simulate('click');
        });
    });

    it('should unplug if element is removed', () => {
        const aggregated$ = Kefir.pool();
        const wrapper = mount(
            <CollectedButton aggregated$={aggregated$} text={'Click me'} enabled={true} />
        );

        wrapper.setProps({ text: 'Click me', enabled: false });

        expect(aggregated$).to.emit([], () => {
            wrapper.simulate('click');
        });
    });

    it('should unplug if unmounted', () => {
        const aggregated$ = Kefir.pool();
        const wrapper = mount(
            <CollectedButton aggregated$={aggregated$} text={'Click me'} enabled={true} />
        );

        wrapper.unmount();

        expect(aggregated$._curSources).to.have.lengthOf(0);
    });

    it('should work with embedded observables', () => {
        const aggregated$ = Kefir.pool();
        const wrapper = mount(
            <Provider value={aggregated$}>
                <Collector silt-embeddable>
                    <div>{Kefir.constant(<p>Hello world!</p>)}</div>
                </Collector>
            </Provider>
        );

        expect(wrapper.html()).to.equal('<div><p>Hello world!</p></div>');
    });

    it('should render embedded sibling observables', () => {
        const aggregated$ = Kefir.pool();
        const wrapper = mount(
            <Provider value={aggregated$}>
                <Collector>
                    <div>
                        {Kefir.constant(<p>Hello world!</p>)}
                        <p>{'Goodbye world!'}</p>
                    </div>
                </Collector>
            </Provider>
        );

        expect(wrapper.html()).to.equal('<div><p>Hello world!</p><p>Goodbye world!</p></div>');
    });

    it('should emit from emedded observables without embeddable prop', () => {
        const aggregated$ = Kefir.pool();
        const wrapper = mount(
            <Provider value={aggregated$}>
                <Collector>
                    <div>
                        {Kefir.constant(
                            <button onClick={e$ => e$.map(() => ({ type: 'CLICK' }))}>
                                Click me!
                            </button>
                        )}
                    </div>
                </Collector>
            </Provider>
        );

        expect(aggregated$).to.emit([value({ type: 'CLICK' })], () => {
            wrapper.find('button').simulate('click');
        });
    });

    it('should emit from emedded sibling observables without embeddable prop', () => {
        const aggregated$ = Kefir.pool();
        const wrapper = mount(
            <Provider value={aggregated$}>
                <Collector>
                    <div>
                        <p>Hello world!</p>
                        {Kefir.constant(
                            <button onClick={e$ => e$.map(() => ({ type: 'CLICK' }))}>
                                Click me!
                            </button>
                        )}
                    </div>
                </Collector>
            </Provider>
        );

        expect(aggregated$).to.emit([value({ type: 'CLICK' })], () => {
            wrapper.find('button').simulate('click');
        });
    });

    it('should work with embeddable prop', () => {
        const aggregated$ = Kefir.pool();
        const wrapper = mount(
            <Provider value={aggregated$}>
                <Collector silt-embeddable>
                    {Kefir.constant(
                        <button onClick={e$ => e$.map(() => ({ type: 'CLICK' }))}>
                            Click me!
                        </button>
                    )}
                </Collector>
            </Provider>
        );

        expect(aggregated$).to.emit([value({ type: 'CLICK' })], () => {
            wrapper.find('button').simulate('click');
        });
    });
});
