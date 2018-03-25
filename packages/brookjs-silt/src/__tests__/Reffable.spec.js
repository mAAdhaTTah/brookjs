/* eslint-env mocha */
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Kefir } from 'brookjs';
import PropTypes from 'prop-types';
import { chaiPlugin } from 'brookjs-desalinate';
import h from '../h';
import Reffable from '../Reffable';

const { plugin, value } = chaiPlugin({ Kefir });

configure({ adapter: new Adapter() });
use(plugin);
use(sinonChai);

const Instance = ({ text, callback }) => (
    <Reffable callback={callback}>
        <button>
            {text}
        </button>
    </Reffable>
);

describe('Reffable', () => {
    it('should emit value from ref$', () => {
        const aggregated$ = Kefir.pool();
        const callback = sinon.spy(() => Kefir.constant({ type: 'REF$' }));
        mount(
            <Instance text={'Click me!'} callback={callback} />,
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
            <Instance text={'Click me!'} callback={callback} />,
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
                <Instance
                    text={'Click me!'}
                    callback={(el, { didMount$ }) => didMount$} />,
                {
                    context: { aggregated$ },
                    childContextTypes: { aggregated$: PropTypes.instanceOf(Kefir.Observable) }
                }
            );
        });
    });

    it('should emit from didUpdate$', () => {
        const aggregated$ = Kefir.pool();

        expect(aggregated$).to.emitInTime([[60, value(1060)]], tick => {
            const wrapper = mount(
                <Instance text={'Click me!'} callback={(el, { didUpdate$ }) => didUpdate$} />,
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
