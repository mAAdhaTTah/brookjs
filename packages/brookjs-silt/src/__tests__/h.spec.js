/* eslint-env mocha */
import { configure, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16.3';
import { expect, use } from 'chai';
import { chaiPlugin } from 'brookjs-desalinate';
import Kefir from 'kefir';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import h from '../h';

const { plugin } = chaiPlugin({ Kefir });

configure({ adapter: new Adapter() });
use(plugin);
use(sinonChai);

describe('h', () => {
    describe('interop', () => {
        it('should return a plain react element', () => {
            const actual = render(<p>Hello world!</p>);

            expect(actual.toString()).to.equal('<p>Hello world!</p>');
        });

        it('should return a plain react element with key', () => {
            const actual = render(<p key="k">Hello world!</p>);

            expect(actual.toString()).to.equal('<p>Hello world!</p>');
        });

        it('should return plain nested react element', () => {
            const actual = render(<p>Just testing <span>constants</span>.</p>);

            expect(actual.toString()).to.equal('<p>Just testing <span>constants</span>.</p>');
        });
    });

    describe('children', () => {
        it('should render text from observable', () => {
            const actual = render(<p>{Kefir.constant('Hello world!')}</p>);

            expect(actual.toString()).to.equal('<p>Hello world!</p>');
        });

        it('should render text from observable in array', () => {
            const actual = render(<p>{[Kefir.constant('Hello world!')]}</p>);

            expect(actual.toString()).to.equal('<p>Hello world!</p>');
        });

        it('should render an element from observable', () => {
            const actual = render(<div>{Kefir.constant(<p>Hello world!</p>)}</div>);

            expect(actual.toString()).to.equal('<div><p>Hello world!</p></div>');
        });

        it('should render observable sibling', () => {
            const actual = render(<p>Hello {Kefir.constant('world!')}</p>);

            expect(actual.toString()).to.equal('<p>Hello world!</p>');
        });

        it('should render deeply nested elements and observables', () => {
            const actual = render(
                <div>
                    <div key="a">a</div>
                    {[<div key="b">b</div>, Kefir.constant([
                        <div key="c">c</div>,
                        [<div key="d">d</div>]
                    ])]}
                </div>
            );

            expect(actual.toString()).to.equal('<div><div>a</div><div>b</div><div>c</div><div>d</div></div>');
        });

        const Spread = props => <div {...props} />;

        it('should render children of custom components', () => {
            const actual = render(
                <Spread>
                    Hello {Kefir.constant('world!')}
                </Spread>
            );

            expect(actual.toString()).to.equal('<div>Hello world!</div>');
        });

        it('should render nested children of custom components', () => {
            const actual = render(
                <Spread>
                    <span>{Kefir.constant('Hello world!')}</span>
                </Spread>
            );

            expect(actual.toString()).to.equal('<div><span>Hello world!</span></div>');
        });

        const ChildrenWithSibling = ({ children }) => <div>Test: {children}</div>;

        it('should render children with siblings correctly', () => {
            const actual = render(
                <ChildrenWithSibling>
                    Hello {Kefir.constant('world!')}
                </ChildrenWithSibling>
            );

            expect(actual.toString()).to.equal('<div>Test: Hello world!</div>');
        });

        it('should warn when passing stream', () => {
            const warn = sinon.stub(console, 'warn');
            render(<p>{new Kefir.Stream().setName('child$')}</p>);

            expect(warn).to.have.been.calledWith(`Observable [child$] is not a property. You may experience incomplete renders without an initial value.`);
            warn.restore();
        });
    });

    describe('attributes', () => {
        it('should render attribute from observable', () => {
            const actual = render(<p id={Kefir.constant('an-id')}>Hello world!</p>);

            expect(actual.toString()).to.equal('<p id="an-id">Hello world!</p>');
        });

        describe('style', () => {
            it('should render style from observable on object property', () => {
                const actual = render(
                    <div onClick={() => {}}
                        style={{
                            display: 'block',
                            color: Kefir.constant('red'),
                            background: 'green'
                        }}>
                        <p>{Kefir.constant(['Hello'])}</p>
                        <p>{Kefir.constant(['World'])}</p>
                    </div>
                );

                expect(actual.toString()).to.equal(
                    '<div style="display:block;color:red;background:green">' +
                        '<p>Hello</p>' +
                        '<p>World</p>' +
                    '</div>'
                );
            });

            it('should render style from observable of object', () => {
                const actual = render(
                    <a href="#lol" style={Kefir.constant({ color: 'red' })}>
                        {Kefir.constant('Hello')} {Kefir.constant('world!')}
                    </a>
                );

                expect(actual.toString()).to.equal('<a href="#lol" style="color:red">Hello world!</a>');
            });
        });
    });

    describe('silt-embeddable', () => {
        const Custom = ({ prop, ...props }) => (
            <div>{`${prop} ${JSON.stringify(props)}`}</div>
        );

        it('should behave normally if not embeddable', () => {
            const actual = render(
                <Custom prop={Kefir.constant('not-embeddable')}/>
            );

            expect(actual.toString()).to.equal('<div>[constant] {}</div>');
        });

        it('should allow observables to be embedded into custom components', () => {
            const actual = render(
                <Custom silt-embeddable prop={Kefir.constant('embeddable')} />
            );

            expect(actual.toString()).to.equal('<div>embeddable {}</div>');
        });

        it('should accept regular props if embeddable', () => {
            const actual = render(
                <Custom silt-embeddable prop={'embeddable-anyway'}/>
            );

            expect(actual.toString()).to.equal('<div>embeddable-anyway {}</div>');
        });
    });

    describe('ref', () => {
        const WithRef = ({ refCallback, text$ }) => (
            <p ref={refCallback}>{text$}</p>
        );

        it('should call callback with reference', () => {
            const ref = sinon.spy();

            mount(<WithRef refCallback={ref} text$={'Hello world'}/>);

            expect(ref).to.have.callCount(1);
            expect(ref.getCall(0).args[0].outerHTML).to.equal('<p>Hello world</p>');
        });

        it('should call callback with reference with embedded observable', () => {
            const ref = sinon.spy();

            mount(<WithRef refCallback={ref} text$={Kefir.constant('Hello world')}/>);

            expect(ref).to.have.callCount(1);
            expect(ref.getCall(0).args[0].outerHTML).to.equal('<p>Hello world</p>');
        });
    });
});
