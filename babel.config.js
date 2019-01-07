module.exports = api => {
  api.cache(true);

  return {
    presets: ['brookjs', '@babel/typescript', '@babel/env'],
    env: {
      test: {
        plugins: ['@babel/transform-modules-commonjs']
      }
    }
  };
};
