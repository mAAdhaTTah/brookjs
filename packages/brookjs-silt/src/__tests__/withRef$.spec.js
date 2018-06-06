/* eslint-env mocha */
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { expect, use } from 'chai';
// import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Kefir } from 'brookjs';
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

describe.skip('withRef$', () => {
    it('should emit value from ref$', () => {
        const aggregated$ = Kefir.pool();
        const wrapper = mount(
            <Instance
                text={'Click me!'}
                aggregated$={aggregated$} />
        );

        expect(aggregated$).to.emit([value([wrapper.find('button'), { text: 'Click me!' }], { current: true })]);
    });
});
