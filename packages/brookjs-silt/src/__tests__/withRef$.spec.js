/* eslint-env mocha */
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { expect, use } from 'chai';
// import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Kefir from 'kefir';
import { chaiPlugin } from 'brookjs-desalinate';
import h from '../h';
import withRef$ from '../withRef$';
import { Provider } from '../context';

const { plugin, value } = chaiPlugin({ Kefir });

configure({ adapter: new Adapter() });
use(plugin);
use(sinonChai);

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

        expect(aggregated$).to.emit([value([wrapper.find('button').instance(), { text: 'Click me!' }], { current: true })]);
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
});
