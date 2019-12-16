/* eslint-env jest */
import ofType from '../ofType';

const { send, value, stream } = KTU;

describe('ofType', () => {
  it('should match when passing one type', () => {
    const action$ = stream();

    expect(action$.thru(ofType('MATCHED'))).toEmit(
      [value({ type: 'MATCHED' })],
      () => {
        send(action$, [
          value({ type: 'UNMATCHED' }),
          value({ type: 'MATCHED' })
        ]);
      }
    );
  });

  it('should match when passing one type with Function#toString', () => {
    const matched = () => ({ type: 'MATCHED' });
    matched.toString = () => 'MATCHED';
    const action$ = stream();

    expect(action$.thru(ofType(matched))).toEmit(
      [value({ type: 'MATCHED' })],
      () => {
        send(action$, [
          value({ type: 'UNMATCHED' }),
          value({ type: 'MATCHED' })
        ]);
      }
    );
  });

  it('should match when passing multiple types', () => {
    const action$ = stream();

    expect(action$.thru(ofType('MATCHED_ONE', 'MATCHED_TWO'))).toEmit(
      [value({ type: 'MATCHED_ONE' }), value({ type: 'MATCHED_TWO' })],
      () => {
        send(action$, [
          value({ type: 'MATCHED_ONE' }),
          value({ type: 'UNMATCHED' }),
          value({ type: 'MATCHED_TWO' }),
          value({ type: 'UNMATCHED_AGAIN' })
        ]);
      }
    );
  });

  it('should match when passing multiple types with Function#toString', () => {
    const matchedOne = () => ({ type: 'MATCHED_ONE' });
    matchedOne.toString = () => 'MATCHED_ONE';
    const matchedTwo = () => ({ type: 'MATCHED_TWO' });
    matchedTwo.toString = () => 'MATCHED_TWO';
    const action$ = stream();

    expect(action$.thru(ofType(matchedOne, matchedTwo))).toEmit(
      [value({ type: 'MATCHED_ONE' }), value({ type: 'MATCHED_TWO' })],
      () => {
        send(action$, [
          value({ type: 'MATCHED_ONE' }),
          value({ type: 'UNMATCHED' }),
          value({ type: 'MATCHED_TWO' }),
          value({ type: 'UNMATCHED_AGAIN' })
        ]);
      }
    );
  });
});
