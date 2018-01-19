/* eslint-env mocha */
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect, use } from 'chai';
import { Kefir } from 'brookjs';
import { chaiPlugin } from 'brookjs-desalinate';
import PropTypes from 'prop-types';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Collector from '../Collector';
import h from '../h';
import Aggregator from '../Aggregator';

const { plugin, value } = chaiPlugin({ Kefir });

configure({ adapter: new Adapter() });
use(plugin);
use(sinonChai);

describe('events aggregation', () => {
    describe('Collector', () => {

        const CollectedButton = ({ text, enabled }) => (
            <Collector>
                {enabled ?
                    <button onClick={e$ => e$.map(() => ({ type: 'CLICK' }))}>
                        {text}
                    </button> :
                    <span>nothing to click</span>}
            </Collector>
        );

        it('should render children normally', () => {
            const aggregated$ = Kefir.pool();
            const wrapper = mount(
                <CollectedButton text={'Click me'} enabled={true} />,
                {
                    context: { aggregated$ },
                    childContextTypes: { aggregated$: PropTypes.instanceOf(Kefir.Observable) }
                }
            );

            expect(wrapper.html()).to.equal('<button>Click me</button>');
        });

        it('should update children normally', () => {
            const aggregated$ = Kefir.pool();
            const wrapper = mount(
                <CollectedButton text={'Click me'} enabled={true} />,
                {
                    context: { aggregated$ },
                    childContextTypes: { aggregated$: PropTypes.instanceOf(Kefir.Observable) }
                }
            );

            wrapper.setProps({ text: 'Click me', enabled: false });

            expect(wrapper.html()).to.equal('<span>nothing to click</span>');
        });

        it('should emit events through aggregated stream', () => {
            const aggregated$ = Kefir.pool();
            const wrapper = mount(
                <CollectedButton text={'Click me'} enabled={true} />,
                {
                    context: { aggregated$ },
                    childContextTypes: { aggregated$: PropTypes.instanceOf(Kefir.Observable) }
                }
            );

            expect(aggregated$).to.emit([value({ type: 'CLICK' })], () => {
                wrapper.simulate('click');
            });
        });

        it('should unplug if element is removed', () => {
            const aggregated$ = Kefir.pool();
            const wrapper = mount(
                <CollectedButton text={'Click me'} enabled={true} />,
                {
                    context: { aggregated$ },
                    childContextTypes: { aggregated$: PropTypes.instanceOf(Kefir.Observable) }
                }
            );

            wrapper.setProps({ text: 'Click me', enabled: false });

            expect(aggregated$).to.emit([], () => {
                wrapper.simulate('click');
            });
        });

        it('should unplug if unmounted', () => {
            const aggregated$ = Kefir.pool();
            const wrapper = mount(
                <CollectedButton text={'Click me'} enabled={true} />,
                {
                    context: { aggregated$ },
                    childContextTypes: { aggregated$: PropTypes.instanceOf(Kefir.Observable) }
                }
            );

            wrapper.unmount();

            expect(aggregated$._curSources).to.have.lengthOf(0);
        });

        it('should work with embedded observables', () => {
            const aggregated$ = Kefir.pool();
            const wrapper = mount(
                <Collector silt-embeddable>
                    <div>{Kefir.constant(<p>Hello world!</p>)}</div>
                </Collector>,
                {
                    context: { aggregated$ },
                    childContextTypes: { aggregated$: PropTypes.instanceOf(Kefir.Observable) }
                }
            );

            expect(wrapper.html()).to.equal('<div><p>Hello world!</p></div>');
        });

        it('should work with embedded sibling observables', () => {
            const aggregated$ = Kefir.pool();
            const wrapper = mount(
                <Collector>
                    <div>
                        {Kefir.constant(<p>Hello world!</p>)}
                        <p>{'Goodbye world!'}</p>
                    </div>
                </Collector>,
                {
                    context: { aggregated$ },
                    childContextTypes: { aggregated$: PropTypes.instanceOf(Kefir.Observable) }
                }
            );

            expect(wrapper.html()).to.equal('<div><p>Hello world!</p><p>Goodbye world!</p></div>');
        });
    });

    describe('Aggregator', () => {
        it('should provide aggregated$ as context', () => {
            const spy = sinon.spy(() => {});
            mount(
                <Aggregator action$={spy}>
                    <p>Hello world!</p>
                </Aggregator>
            );

            expect(spy).to.have.callCount(1);
            expect(spy.getCall(0).args[0]).to.be.observable();
        });

        it('should call unsubscribe when unmounted', () => {
            const spy = sinon.spy(x => x.observe());
            const wrapper = mount(
                <Aggregator action$={spy}>
                    <p>Hello world!</p>
                </Aggregator>
            );

            wrapper.unmount();

            expect(spy.getCall(0).args[0]).to.not.be.active();
        });

        it('should function correctly when nothing returned', () => {
            const spy = sinon.spy(() => {});
            const wrapper = mount(
                <Aggregator action$={spy}>
                    <p>Hello world!</p>
                </Aggregator>
            );

            wrapper.unmount();

            expect(spy.getCall(0).args[0]).to.not.be.active();
        });
    });
});
