/* eslint-env jest */
import { jestPlugin } from 'brookjs-desalinate';
import Kefir from 'kefir';
import exec from '../exec';

const { extensions } = jestPlugin({ Kefir });
expect.extend(extensions);

jest.mock('../../../services', () => ({
  WebpackService: {} as any,
  glob: jest.fn()
}));

describe('NewCommand#exec', () => {
  it('should not do anything before creating', () => {
    expect(exec).toEmitFromDelta([], sendToDelta => {
      sendToDelta(
        { type: 'DUMMY' },
        {
          step: 'configure'
        }
      );
      sendToDelta(
        { type: 'DUMMY' },
        {
          step: 'confirm'
        }
      );
      sendToDelta(
        { type: 'DUMMY' },
        {
          step: 'cancelled'
        }
      );
      sendToDelta(
        { type: 'DUMMY' },
        {
          step: 'complete'
        }
      );
    });
  });
});
