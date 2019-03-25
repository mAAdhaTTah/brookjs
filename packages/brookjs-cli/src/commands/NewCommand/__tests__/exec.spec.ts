import sinon from 'sinon';
import { expect, use } from 'chai';
import { chaiPlugin } from 'brookjs-desalinate';
import Kefir from 'kefir';
import exec from '../exec';

const { plugin, value } = chaiPlugin({ Kefir });
use(plugin);

describe('NewCommand#exec', () => {
  it('should not do anything before creating', () => {
    const services = {
      WebpackService: {

      } as any,
      glob: sinon.stub()
    };
    expect(exec(services)).to.emitFromDelta([], sendToDelta => {
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
