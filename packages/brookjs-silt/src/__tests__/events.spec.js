/* eslint-env mocha */
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect, use } from 'chai';
import { Kefir } from 'brookjs';
import { chaiPlugin } from 'brookjs-desalinate';
import PropTypes from 'prop-types';
import Collector from '../Collector';
import h from '../h';

const { plugin, value } = chaiPlugin({ Kefir });

configure({ adapter: new Adapter() });
use(plugin);

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
    });
});
