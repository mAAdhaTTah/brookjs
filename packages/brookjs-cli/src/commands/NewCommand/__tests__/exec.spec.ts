/* eslint-env jest */
import { jestPlugin } from 'brookjs-desalinate';
import Kefir from 'kefir';
import exec from '../exec';

const { extensions } = jestPlugin({ Kefir });
expect.extend(extensions);

describe('NewCommand#exec', () => {
  it('should not do anything before creating', () => {
    const services = {
      WebpackService: {} as any,
      glob: jest.fn()
    };
    expect(exec(services)).toEmitFromDelta([], sendToDelta => {
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
