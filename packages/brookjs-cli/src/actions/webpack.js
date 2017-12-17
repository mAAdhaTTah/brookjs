export const WEBPACK_COMPILED = 'WEBPACK_COMPILED';

export const webpackCompiled = stats => ({
    type: WEBPACK_COMPILED,
    payload: { stats }
});

export const WEBPACK_DASHBOARD_EVENTS = 'WEBPACK_DASHBOARD_EVENTS';

export const webpackDashboardEvents = events => ({
    type: WEBPACK_DASHBOARD_EVENTS,
    payload: { events }
});
