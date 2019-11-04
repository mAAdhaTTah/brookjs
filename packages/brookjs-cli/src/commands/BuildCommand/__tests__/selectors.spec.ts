/* eslint-env jest */
import { jestPlugin } from 'brookjs-desalinate';
import Kefir from 'kefir';
import { selectWebpackConfig } from '../selectors';
import { State } from '../types';

const { extensions } = jestPlugin({ Kefir });
expect.extend(extensions);

describe('BuildCommand#selectors', () => {
  describe('selectWebpackConfig', () => {
    it('should call the modifier when creating webpack config', () => {
      const config = {};
      const modifier = jest.fn().mockReturnValue(config);
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

      expect(config).toBe(results);
    });
  });
});
