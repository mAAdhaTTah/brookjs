/* eslint-env mocha */
import Adapter from 'enzyme-adapter-react-16.3';
import { configure, mount } from 'enzyme';
import { expect, use } from 'chai';
import Kefir from 'kefir';
import { chaiPlugin } from 'brookjs-desalinate';
import h from '../h';
import withRef$ from '../withRef';
import { Provider } from '../context';

const { plugin, value } = chaiPlugin({ Kefir });

configure({ adapter: new Adapter() });
use(plugin);

const Button = withRef$(({ text }, ref) => (
    <button ref={ref}>
        {text}
    </button>
), (ref$, props) => ref$.map(el => [el, props]));

const Instance = ({ text, aggregated$ }) => (
    <Provider value={aggregated$}>
        <Button text={text} />
    </Provider>
);

describe('withRef$', () => {
    it('should emit value from ref$', () => {
        const aggregated$ = Kefir.pool();
        const wrapper = mount(
            <Instance
                text={'Click me!'}
                aggregated$={aggregated$} />
        );

        expect(aggregated$).to.emit([value(
            [wrapper.find('button').instance(), { text: 'Click me!' }],
            { current: true }
        )]);
    });

    it('should remove ref$ when unmounted', () => {
        const aggregated$ = Kefir.pool();
        const wrapper = mount(
            <Instance
                text={'Click me!'}
                aggregated$={aggregated$} />
        );

        wrapper.unmount();

        expect(aggregated$._curSources).to.have.lengthOf(0);
    });

    it('should replace aggregated$', () => {
        const aggregated$ = Kefir.pool();
        const newAggregated$ = Kefir.pool();
        const wrapper = mount(
            <Instance
                text={'Click me!'}
                aggregated$={aggregated$} />
        );

        wrapper.setProps({ text: 'Click me!', aggregated$: newAggregated$ });

        expect(aggregated$._curSources).to.have.lengthOf(0);
        expect(newAggregated$._curSources).to.have.lengthOf(1);

        expect(newAggregated$).to.emit([value(
            [wrapper.find('button').instance(), { text: 'Click me!' }],
            { current: true }
        )]);
    });
});
