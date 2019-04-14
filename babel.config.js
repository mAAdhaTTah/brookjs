module.exports = api => {
  api.cache(false);

  return {
    plugins: [
      '@babel/plugin-proposal-class-properties',
      process.env.NODE_ENV === 'test' && '@babel/transform-modules-commonjs'
    ].filter(Boolean),
    presets: [
      'brookjs',
      process.env.NODE_ENV === 'test'
        ? [
            '@babel/env',
            {
              targets: {
                node: 'current'
              }
            }
          ]
        : '@babel/env',
      '@babel/typescript',
      '@babel/react'
    ]
  };
};
