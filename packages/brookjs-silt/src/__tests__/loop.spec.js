/* eslint-env mocha */
// @flow
// @jsx h
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect, use } from 'chai';
import { Kefir } from 'brookjs';
import { chaiPlugin } from 'brookjs-desalinate';
import loop from '../loop';
import h from '../h';

configure({ adapter: new Adapter() });
const { plugin, prop, value, send } = chaiPlugin({ Kefir });
use(plugin);

describe('loop', () => {
    it('should be a function', () => {
        expect(loop).to.be.a('function');
    });

    it('should take a callback and return a function', () => {
        expect(loop(() => Kefir.never(<div>Child</div>))).to.be.a('function');
    });

    it('should render a single child', () => {
        const a = send(prop(), [value({
            order: ['a'],
            dict: {
                a: {
                    text: 'first box'
                }
            }
        })]);
        const dom = mount(
            <div>
                {a.thru(loop((child$, id) => (
                    <p key={id}>{id} {child$.map(props => props.text)}</p>
                )))}
            </div>
        );

        expect(dom.html()).to.equal(`<div><p>a first box</p></div>`);
    });

    it('should update a single child', () => {
        const a = send(prop(), [value({
            order: ['a'],
            dict: { a: { text: 'first box' } }
        })]);
        const dom = mount(
            <div>
                {a.thru(loop((child$, id) => (
                    <p key={id}>{id} {child$.map(props => props.text)}</p>
                )))}
            </div>
        );

        send(a, [value({
            order: ['a'],
            dict: { a: { text: 'first p tag' } }
        })]);

        expect(dom.html()).to.equal(`<div><p>a first p tag</p></div>`);
    });

    it('should render multiple children', () => {
        const a = send(prop(), [value({
            order: ['a', 'b'],
            dict: {
                a: { text: 'first box' },
                b: { text: 'second box' }
            }
        })]);
        const dom = mount(
            <div>
                {a.thru(loop((child$, id) => (
                    <p key={id}>{id} {child$.map(props => props.text)}</p>
                )))}
            </div>
        );

        expect(dom.html()).to.equal(`<div><p>a first box</p><p>b second box</p></div>`);
    });

    it('should update multiple children', () => {
        const a = send(prop(), [value({
            order: ['a', 'b'],
            dict: {
                a: { text: 'first box' },
                b: { text: 'second box' }
            }
        })]);
        const dom = mount(
            <div>
                {a.thru(loop((child$, id) => (
                    <p key={id}>{id} {child$.map(props => props.text)}</p>
                )))}
            </div>
        );

        send(a, [value({
            order: ['a', 'b'],
            dict: {
                a: { text: 'first p tag' },
                b: { text: 'second p tag' }
            }
        })]);

        expect(dom.html()).to.equal(`<div><p>a first p tag</p><p>b second p tag</p></div>`);
    });

    it('should rearrange children', () => {
        const a = send(prop(), [value({
            order: ['a', 'b'],
            dict: {
                a: { text: 'first box' },
                b: { text: 'second box' }
            }
        })]);
        const dom = mount(
            <div>
                {a.thru(loop((child$, id) => (
                    <p key={id}>{id} {child$.map(props => props.text)}</p>
                )))}
            </div>
        );

        send(a, [value({
            order: ['b', 'a'],
            dict: {
                a: { text: 'first box' },
                b: { text: 'second box' }
            }
        })]);

        expect(dom.html()).to.equal(`<div><p>b second box</p><p>a first box</p></div>`);
    });

    it('should add child', () => {
        const a = send(prop(), [value({
            order: ['a', 'b'],
            dict: {
                a: { text: 'first box' },
                b: { text: 'second box' }
            }
        })]);
        const dom = mount(
            <div>
                {a.thru(loop((child$, id) => (
                    <p key={id}>{id} {child$.map(props => props.text)}</p>
                )))}
            </div>
        );

        send(a, [value({
            order: ['a', 'b', 'c'],
            dict: {
                a: { text: 'first box' },
                b: { text: 'second box' },
                c: { text: 'third box' },
            }
        })]);

        expect(dom.html()).to.equal(`<div><p>a first box</p><p>b second box</p><p>c third box</p></div>`);
    });

    it('should remove child', () => {
        const a = send(prop(), [value({
            order: ['a', 'b'],
            dict: {
                a: { text: 'first box' },
                b: { text: 'second box' }
            }
        })]);
        const dom = mount(
            <div>
                {a.thru(loop((child$, id) => (
                    <p key={id}>{id} {child$.map(props => props.text)}</p>
                )))}
            </div>
        );

        send(a, [value({
            order: ['a'],
            dict: {
                a: { text: 'first box' },
            }
        })]);

        expect(dom.html()).to.equal(`<div><p>a first box</p></div>`);
    });

    it('should not emit value if order unchanged', () => {
        const a = send(prop(), [value({
            order: ['a', 'b'],
            dict: {
                a: { text: 'first box' },
                b: { text: 'second box' }
            }
        })]);
        const dom$ = a.thru(loop((child$, id) => (id: any)));

        send(a, [value({
            order: ['a', 'b'],
            dict: {
                a: { text: 'first box' },
                b: { text: 'second box' }
            }
        })]);

        expect(dom$).to.emit([value(['a', 'b'], { current: true })], () => {
            send(a, [value({
                order: ['a', 'b'],
                dict: {
                    a: { text: 'first box' },
                    b: { text: 'second box' }
                }
            })]);
        });
    });

    it('should take map function', () => {
        const a = send(prop(), [value({
            loopable: {
                order: ['a', 'b'],
                dict: {
                    a: { text: 'first box' },
                    b: { text: 'second box' }
                }
            }
        })]);

        const dom$ = a.thru(loop(props => props.loopable, (child$, id) => (id: any)));

        expect(dom$).to.emit([value(['a', 'b'], { current: true })]);
    });
});
