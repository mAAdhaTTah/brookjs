module.exports = function helper(hexo) {
    return {
        compare: function compare(prev, next) {
            return prev === next;
        }
    };
};
