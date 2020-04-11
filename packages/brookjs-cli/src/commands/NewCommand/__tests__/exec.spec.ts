/* eslint-env jest */
import exec from '../exec';

describe('NewCommand#exec', () => {
  it('should not do anything before creating', () => {
    expect(exec).toEmitFromDelta([], sendToDelta => {
      sendToDelta(
        { type: 'DUMMY' },
        {
          step: 'configure',
        },
      );
      sendToDelta(
        { type: 'DUMMY' },
        {
          step: 'confirm',
        },
      );
      sendToDelta(
        { type: 'DUMMY' },
        {
          step: 'cancelled',
        },
      );
      sendToDelta(
        { type: 'DUMMY' },
        {
          step: 'complete',
        },
      );
    });
  });
});
