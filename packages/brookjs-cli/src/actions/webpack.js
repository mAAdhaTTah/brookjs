export const WEBPACK_COMPILED = 'WEBPACK_COMPILED';

export const webpackCompiled = stats => ({
    type: WEBPACK_COMPILED,
    payload: { stats }
});
