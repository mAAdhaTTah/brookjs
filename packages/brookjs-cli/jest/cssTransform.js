// This is stolen from react-scripts
// @TODO(mAAdhaTTah) depend on it directly
module.exports = {
  process() {
    return 'module.exports = {};';
  },
  getCacheKey() {
    return 'cssTransform';
  },
};
