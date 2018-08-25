/* eslint-env mocha */
/* eslint-disable no-console */
import { expect, use } from 'chai';
import Adapter from 'enzyme-adapter-react-16.3';
import { configure, mount } from 'enzyme';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import Kefir from 'kefir';
import { chaiPlugin } from 'brookjs-desalinate';
import PropTypes from 'prop-types';
import h from '../h';
import observableOf from '../observableOf';

const { plugin , prop, value, send, error, end } = chaiPlugin({ Kefir });
use(plugin);
configure({ adapter: new Adapter() });
use(sinonChai);

describe('observableOf', () => {
    let wrapper;

    beforeEach(() => {
        sinon.stub(console, 'error');
    });

    afterEach(() => {
        console.error.restore();
        wrapper.unmount();
    });

    it('should not complain if nothing provided', () => {
        const NothingProvided = () => <button>Click me</button>;
        NothingProvided.propTypes = {
            props$: observableOf({})
        };

        wrapper = mount(<NothingProvided />);

        expect(console.error).to.have.callCount(0);
    });

    it('should complain if not-observable provided', () => {
        const NotObservable = () => <button>Click me</button>;
        NotObservable.propTypes = {
            props$: observableOf({})
        };

        wrapper = mount(<NotObservable props$="test" />);

        expect(console.error).to.have.callCount(1)
            .and.have.been.calledWith(
                'Warning: Failed prop type: NotObservable: props$ must be an Observable, got "string"\n' +
                '    in NotObservable'
            );
    });

    it('should pass if observable provided', () => {
        const props$ = prop();
        const ObservableProvided = () => <button>Click me</button>;
        ObservableProvided.propTypes = {
            props$: observableOf({})
        };

        wrapper = mount(<ObservableProvided props$={props$} />);

        expect(console.error).to.have.callCount(0);
    });

    it('should complain if observable emits invalid value', () => {
        const props$ = send(prop(), [value({ text: 0 })]);
        const ObservableInvalidValue = () => <button>Click me</button>;
        ObservableInvalidValue.propTypes = {
            props$: observableOf({
                text: PropTypes.string
            })
        };

        wrapper = mount(<ObservableInvalidValue props$={props$} />);

        expect(console.error).to.have.callCount(1)
            .and.have.been.calledWith(
                'Warning: Failed prop type: Invalid prop `text` of type `number` supplied to `ObservableInvalidValue`, expected `string`.'
            );
    });

    it('should not complain if observable emits valid value', () => {
        const props$ = send(prop(), [value({ text: 'hello' })]);
        const ObservableValidValue = () => <button>Click me</button>;
        ObservableValidValue.propTypes = {
            props$: observableOf({
                text: PropTypes.string
            })
        };

        wrapper = mount(<ObservableValidValue props$={props$} />);

        expect(console.error).to.have.callCount(0);
    });

    it('should ignore if observable emits error', () => {
        const props$ = send(prop(), [error(new Error())]);
        const ObservableError = () => <button>Click me</button>;
        ObservableError.propTypes = {
            props$: observableOf({
                text: PropTypes.string
            })
        };

        wrapper = mount(<ObservableError props$={props$} />);

        expect(console.error).to.have.callCount(0);
    });

    it('should ignore if observable emits end', () => {
        const props$ = send(prop(), [end()]);
        const ObservableEnd = () => <button>Click me</button>;
        ObservableEnd.propTypes = {
            props$: observableOf({
                text: PropTypes.string
            })
        };

        wrapper = mount(<ObservableEnd props$={props$} />);

        expect(console.error).to.have.callCount(0);
    });

    describe('isRequired', () => {
        it('should complain if nothing provided and is required', () => {
            const RequiredObservableNotProvided = () => <button>Click me</button>;
            RequiredObservableNotProvided.propTypes = {
                props$: observableOf({}).isRequired
            };

            wrapper = mount(<RequiredObservableNotProvided />);

            expect(console.error).to.have.callCount(1)
                .and.have.been.calledWith(
                    'Warning: Failed prop type: RequiredObservableNotProvided: props$ must be an Observable, got "undefined"\n' +
                    '    in RequiredObservableNotProvided'
                );
        });

        it('should pass if required observable provided', () => {
            const props$ = prop();
            const RequiredObservableProvided = () => <button>Click me</button>;
            RequiredObservableProvided.propTypes = {
                props$: observableOf({}).isRequired
            };

            wrapper = mount(<RequiredObservableProvided props$={props$} />);

            expect(console.error).to.have.callCount(0);
        });

        it('should complain if required observable emits invalid value', () => {
            const props$ = send(prop(), [value({ text: 0 })]);
            const RequiredObservableInvalidValue = () => <button>Click me</button>;
            RequiredObservableInvalidValue.propTypes = {
                props$: observableOf({
                    text: PropTypes.string
                }).isRequired
            };

            wrapper = mount(<RequiredObservableInvalidValue props$={props$} />);

            expect(console.error).to.have.callCount(1)
                .and.have.been.calledWith(
                    'Warning: Failed prop type: Invalid prop `text` of type `number` supplied to `RequiredObservableInvalidValue`, expected `string`.'
                );
        });

        it('should not complain if required observable emits valid value', () => {
            const props$ = send(prop(), [value({ text: 'hello' })]);;
            const RequiredObservableValidValue = () => <button>Click me</button>;
            RequiredObservableValidValue.propTypes = {
                props$: observableOf({
                    text: PropTypes.string
                }).isRequired
            };

            wrapper = mount(<RequiredObservableValidValue props$={props$} />);

            expect(console.error).to.have.callCount(0);
        });

        it('should ignore if required observable emits error', () => {
            const props$ = send(prop(), [error(new Error())]);
            const RequiredObservableError = () => <button>Click me</button>;
            RequiredObservableError.propTypes = {
                props$: observableOf({
                    text: PropTypes.string
                }).isRequired
            };

            wrapper = mount(<RequiredObservableError props$={props$} />);

            expect(console.error).to.have.callCount(0);
        });

        it('should ignore if required observable emits end', () => {
            const props$ = send(prop(), [end()]);
            const RequiredObservableEnd = () => <button>Click me</button>;
            RequiredObservableEnd.propTypes = {
                props$: observableOf({
                    text: PropTypes.string
                }).isRequired
            };

            wrapper = mount(<RequiredObservableEnd props$={props$} />);

            expect(console.error).to.have.callCount(0);
        });
    });
});
