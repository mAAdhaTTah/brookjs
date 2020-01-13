module.exports = api => {
  api.cache(false);

  return {
    presets: [
      ['brookjs', { typescript: true }]
    ]
  };
};
