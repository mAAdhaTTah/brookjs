/* eslint-env mocha */
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect, use } from 'chai';
import { Kefir } from 'brookjs';
import { chaiPlugin } from 'brookjs-desalinate';
import PropTypes from 'prop-types';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import h from '../h';
import Aggregator from '../Aggregator';
import Collector from '../Collector';
import Reffable from '../Reffable';

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

        it('should render embedded sibling observables', () => {
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

        it('should emit from emedded observables without embeddable prop', () => {
            const aggregated$ = Kefir.pool();
            const wrapper = mount(
                <Collector>
                    <div>
                        {Kefir.constant(
                            <button onClick={e$ => e$.map(() => ({ type: 'CLICK' }))}>
                                Click me!
                            </button>
                        )}
                    </div>
                </Collector>,
                {
                    context: { aggregated$ },
                    childContextTypes: { aggregated$: PropTypes.instanceOf(Kefir.Observable) }
                }
            );

            expect(aggregated$).to.emit([value({ type: 'CLICK' })], () => {
                wrapper.find('button').simulate('click');
            });
        });

        it('should emit from emedded sibling observables without embeddable prop', () => {
            const aggregated$ = Kefir.pool();
            const wrapper = mount(
                <Collector>
                    <div>
                        <p>Hello world!</p>
                        {Kefir.constant(
                            <button onClick={e$ => e$.map(() => ({ type: 'CLICK' }))}>
                                Click me!
                            </button>
                        )}
                    </div>
                </Collector>,
                {
                    context: { aggregated$ },
                    childContextTypes: { aggregated$: PropTypes.instanceOf(Kefir.Observable) }
                }
            );

            expect(aggregated$).to.emit([value({ type: 'CLICK' })], () => {
                wrapper.find('button').simulate('click');
            });
        });

        it('should work with embeddable prop', () => {
            const aggregated$ = Kefir.pool();
            const wrapper = mount(
                <Collector silt-embeddable>
                    {Kefir.constant(
                        <button onClick={e$ => e$.map(() => ({ type: 'CLICK' }))}>
                            Click me!
                        </button>
                    )}
                </Collector>,
                {
                    context: { aggregated$ },
                    childContextTypes: { aggregated$: PropTypes.instanceOf(Kefir.Observable) }
                }
            );

            expect(aggregated$).to.emit([value({ type: 'CLICK' })], () => {
                wrapper.find('button').simulate('click');
            });
        });
    });

    describe('Reffable', () => {
        it('should emit value from ref$', () => {
            const aggregated$ = Kefir.pool();
            const callback = sinon.spy(() => Kefir.constant({ type: 'REF$' }));
            const wrapper = mount(
                <Reffable callback={callback}>
                    <button>
                        Click me!
                    </button>
                </Reffable>,
                {
                    context: { aggregated$ },
                    childContextTypes: { aggregated$: PropTypes.instanceOf(Kefir.Observable) }
                }
            );

            expect(aggregated$).to.emit([value({ type: 'REF$' }, { current: true })]);
        });

        it('should call ref$ with element & api', () => {
            const aggregated$ = Kefir.pool();
            const callback = sinon.spy(() => Kefir.constant({ type: 'REF$' }));
            const wrapper = mount(
                <Reffable callback={callback}>
                    <button>
                        Click me!
                    </button>
                </Reffable>,
                {
                    context: { aggregated$ },
                    childContextTypes: { aggregated$: PropTypes.instanceOf(Kefir.Observable) }
                }
            );

            expect(callback).to.have.been.calledWithMatch(
                wrapper.find('button').getDOMNode(),
                sinon.match({
                    didMount$: sinon.match.instanceOf(Kefir.Observable),
                    didUpdate$: sinon.match.instanceOf(Kefir.Observable)
                })
            );
        });

        it('should emit from didMount$', () => {
            const aggregated$ = Kefir.pool();

            expect(aggregated$).to.emitInTime([[0, value(1000)]], () => {
                mount(
                    <Reffable callback={(el, { didMount$ }) => didMount$}>
                        <button>
                            Click me!
                        </button>
                    </Reffable>,
                    {
                        context: { aggregated$ },
                        childContextTypes: { aggregated$: PropTypes.instanceOf(Kefir.Observable) }
                    }
                );
            });
        });

        it('should emit from didUpdate$', () => {
            const Instance = ({ text }) => (
                <Reffable callback={(el, { didUpdate$ }) => didUpdate$}>
                    <button>
                        {text}
                    </button>
                </Reffable>
            );
            const aggregated$ = Kefir.pool();

            expect(aggregated$).to.emitInTime([[60, value(1060)]], tick => {
                const wrapper = mount(
                    <Instance text={'Click me!'} />,
                    {
                        context: { aggregated$ },
                        childContextTypes: { aggregated$: PropTypes.instanceOf(Kefir.Observable) }
                    }
                );

                tick(60);

                wrapper.setProps({ text: 'Do not click me' });

                expect(wrapper.html()).to.equal('<button>Do not click me</button>');
            });
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
