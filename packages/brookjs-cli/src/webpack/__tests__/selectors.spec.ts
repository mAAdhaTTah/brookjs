import { selectWebpackConfig } from '../selectors';
import { State } from '../types';

describe('BuildCommand#selectors', () => {
  describe('selectWebpackConfig', () => {
    it('should call the modifier when creating webpack config', () => {
      const config = {};
      const modifier = jest.fn().mockReturnValue(config);
      const state: State = {
        watch: false,
        env: 'production',
        extension: 'js',
        cmd: 'build',
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
