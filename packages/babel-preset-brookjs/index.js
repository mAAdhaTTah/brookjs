module.exports = (api, opts) => {
  api.cache(true);

  return {
    presets: [
      // Yeah, there's not really a purpose to this,
      // but it gives us a facade we can make our own
      // customizations on top of, if we want.
      ['react-app', opts]
    ],
    plugins: [
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-optional-chaining'
    ]
  };
};
