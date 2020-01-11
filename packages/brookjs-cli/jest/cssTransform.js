// This is stolen from react-scripts
// @TODO(mAAdhaTTah) depend on it directly
'use strict';

module.exports = {
  process() {
    return 'module.exports = {};';
  },
  getCacheKey() {
    return 'cssTransform';
  },
};
