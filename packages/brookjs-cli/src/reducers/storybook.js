import { combineActionReducers } from 'brookjs';
import { READ_RC_FILE } from '../actions';

/*
type HttpsDisabled = {
    enabled: false,
};
type HttpsEnabled = {
    enabled: true,
    key: string,
    cert: string,
    ca: Array<string>,
}
type HttpsSettings = HttpsEnabled | HttpsDisabled

export type StorybookState = {
    running: boolean,
    staticDirs: Array<string>,
    port: number,
    host: ?string,
    https: HttpsSettings,
};
*/

const defaults /*: StorybookState */ = {
    running: false,
    port: 9001,
    host: null,
    staticDirs: [],
    https: {
        enabled: false
    },
    devServer: {},
    middleware: (router, state) => router
};

const cond = [
    [READ_RC_FILE, (state, { payload }) => ({
        ...state,
        port: payload.storybook.port,
        host: payload.storybook.host,
        staticDirs: payload.storybook.staticDirs,
        https: payload.storybook.https,
        devServer: payload.storybook.devServer,
        middleware: payload.storybook.middleware,
    })]
];

export default combineActionReducers(cond, defaults);
