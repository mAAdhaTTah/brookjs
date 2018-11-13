/* eslint-env mocha */
import { expect, use } from 'chai';
import { chaiPlugin } from 'brookjs-desalinate';
import Kefir from 'kefir';
import ofType from '../ofType';

const { plugin, send, value, stream } = chaiPlugin({ Kefir });
use(plugin);

describe('ofType', () => {
    it('should match when passing one type', () => {
        const action$ = stream();

        expect(action$.thru(ofType('MATCHED')))
            .to.emit([value({ type: 'MATCHED' })], () => {
                send(action$, [
                    value({ type: 'UNMATCHED' }),
                    value({ type: 'MATCHED' })
                ]);
            });
    });

    it('should match when passing one type with Function#toString', () => {
        const matched = () => {};
        matched.toString = () => 'MATCHED';
        const action$ = stream();

        expect(action$.thru(ofType(matched)))
            .to.emit([value({ type: 'MATCHED' })], () => {
                send(action$, [
                    value({ type: 'UNMATCHED' }),
                    value({ type: 'MATCHED' })
                ]);
            });
    });

    it('should match when passing multiple types', () => {
        const action$ = stream();

        expect(action$.thru(ofType('MATCHED_ONE', 'MATCHED_TWO')))
            .to.emit([
                value({ type: 'MATCHED_ONE' }),
                value({ type: 'MATCHED_TWO' })
            ], () => {
                send(action$, [
                    value({ type: 'MATCHED_ONE' }),
                    value({ type: 'UNMATCHED' }),
                    value({ type: 'MATCHED_TWO' }),
                    value({ type: 'UNMATCHED_AGAIN' }),
                ]);
            });
    });

    it('should match when passing multiple types with Function#toString', () => {
        const matchedOne = () => {};
        matchedOne.toString = () => 'MATCHED_ONE';
        const matchedTwo = () => {};
        matchedTwo.toString = () => 'MATCHED_TWO';
        const action$ = stream();

        expect(action$.thru(ofType(matchedOne, matchedTwo)))
            .to.emit([
                value({ type: 'MATCHED_ONE' }),
                value({ type: 'MATCHED_TWO' })
            ], () => {
                send(action$, [
                    value({ type: 'MATCHED_ONE' }),
                    value({ type: 'UNMATCHED' }),
                    value({ type: 'MATCHED_TWO' }),
                    value({ type: 'UNMATCHED_AGAIN' }),
                ]);
            });
    });
});
