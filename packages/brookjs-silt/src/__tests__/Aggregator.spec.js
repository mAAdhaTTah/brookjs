/* eslint-env mocha */
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Kefir from 'kefir';
import { chaiPlugin } from 'brookjs-desalinate';
import h from '../h';
import Aggregator from '../Aggregator';

const { plugin } = chaiPlugin({ Kefir });

configure({ adapter: new Adapter() });
use(plugin);
use(sinonChai);

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
