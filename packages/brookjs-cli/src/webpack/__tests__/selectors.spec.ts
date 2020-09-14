import { selectWebpackConfig } from '../selectors';

describe('BuildCommand#selectors', () => {
  describe('selectWebpackConfig', () => {
    it('should call the modifier when creating webpack config', () => {
      const config = {};
      const modifier = jest.fn().mockReturnValue(config);

      const results = selectWebpackConfig({
        name: 'test-project',
        cmd: 'build',
        cwd: '/path/to/project',
        env: 'production',
        extension: 'js',
        watch: false,
        rc: {
          webpack: {
            modifier,
          },
        },
      });

      expect(config).toBe(results);
    });
  });
});
