/* eslint-env mocha */
import { expect, use } from 'chai';
import { chaiPlugin } from 'brookjs-desalinate';
import Kefir from 'kefir';
import chaiJestSnapshot from 'chai-jest-snapshot';
import sinon from 'sinon';
import { selectWebpackConfig } from '../selectors';
import { State } from '../types';

const { plugin } = chaiPlugin({ Kefir });
use(plugin);
use(chaiJestSnapshot);

describe('BuildCommand#selectors', () => {
  describe('selectWebpackConfig', () => {
    it('should call the modifier when creating webpack config', () => {
      const config = {};
      const modifier = sinon.stub().returns(config);
      const state: State = {
        building: true,
        watch: false,
        env: 'production',
        results: null,
        cwd: '/path/to/cwd',
        rc: {
          webpack: {
            modifier
          } as any
        }
      };

      const results = selectWebpackConfig(state);

      expect(config).to.equal(results);
    });
  });
});
