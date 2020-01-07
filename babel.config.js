module.exports = api => {
  api.cache(false);

  return {
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
      '@babel/react'
    ],
    plugins: [
      // @TODO(mAAdhaTTah) remove isTSX workaround
      ['@babel/transform-typescript', { allowDeclareFields: true, isTSX: true }],
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      process.env.NODE_ENV === 'test' && '@babel/transform-modules-commonjs'
    ].filter(Boolean)
  };
};
