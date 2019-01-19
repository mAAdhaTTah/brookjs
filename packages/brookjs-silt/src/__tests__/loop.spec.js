/* eslint-env mocha */
import { expect, use } from 'chai';
import Kefir from 'kefir';
import { chaiPlugin } from 'brookjs-desalinate';
import loop from '../loop';

const { plugin, prop, value, send } = chaiPlugin({ Kefir });
use(plugin);

describe('loop', () => {
    it('should be a function', () => {
        expect(loop).to.be.a('function');
    });

    it('should take a callback and return a function', () => {
        expect(loop(() => Kefir.never())).to.be.a('function');
    });

    it('should take loop', () => {
        const a = send(prop(), [value({
            order: ['a', 'b'],
            dict: {
                a: { text: 'first box' },
                b: { text: 'second box' }
            }
        })]);

        const dom$ = a.thru(loop((child$, id) => id));

        expect(dom$).to.emit([value(['a', 'b'], { current: true })]);
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

        const dom$ = a.thru(loop(props => props.loopable, (child$, id) => id));

        expect(dom$).to.emit([value(['a', 'b'], { current: true })]);
    });
});
