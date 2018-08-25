/* eslint-env mocha */
import Adapter from 'enzyme-adapter-react-16.3';
import { configure, mount } from 'enzyme';
import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Kefir from 'kefir';
import { chaiPlugin } from 'brookjs-desalinate';
import h from '../h';
import RootJunction from '../RootJunction';

const { plugin } = chaiPlugin({ Kefir });

configure({ adapter: new Adapter() });
use(plugin);
use(sinonChai);

describe('RootJunction', () => {
    it('should provide aggregated$ as context', () => {
        const spy = sinon.spy(() => {});
        mount(
            <RootJunction root$={spy}>
                <p>Hello world!</p>
            </RootJunction>
        );

        expect(spy).to.have.callCount(1);
        expect(spy.getCall(0).args[0]).to.be.observable();
    });

    it('should call unsubscribe when unmounted', () => {
        const spy = sinon.spy(x => x.observe());
        const wrapper = mount(
            <RootJunction root$={spy}>
                <p>Hello world!</p>
            </RootJunction>
        );

        wrapper.unmount();

        expect(spy.getCall(0).args[0]).to.not.be.active();
    });

    it('should function correctly when nothing returned', () => {
        const spy = sinon.spy(() => {});
        const wrapper = mount(
            <RootJunction root$={spy}>
                <p>Hello world!</p>
            </RootJunction>
        );

        wrapper.unmount();

        expect(spy.getCall(0).args[0]).to.not.be.active();
    });
});
