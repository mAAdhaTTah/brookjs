export * from './npm';

export const RUN = 'RUN';

/**
 * Create a new run action.
 *
 * @param {string} command - Command to run.
 * @param {Object} args - Arguments to command.
 * @param {Object} options - Options for command.
 * @returns {Action} Run action.
 */
export function run (command, args, options) {
    return {
        type: RUN,
        payload: { command, args, options }
    };
}

export const INIT_CONFIG_RESPONSE = 'INIT_CONFIG_RESPONSE';

/**
 * Create a new respond with root action.
 *
 * @returns {Action} Respond with root action.
 */
export function initConfigResponse ({ name, dir, author, version, description, keywords = [], license }) {
    return {
        type: INIT_CONFIG_RESPONSE,
        payload: { name, dir, author, version, description, keywords, license }
    };
}

export const CONFIRM_CONFIG = 'CONFIRM_CONFIG';

/**
 * Create a new config confirm action.
 *
 * @param {bool} confirmed - Whether the config was confirmed.
 * @returns {Action} Config confirm action.
 */
export function confirmConfig ({ confirmed }) {
    return {
        type: CONFIRM_CONFIG,
        payload: { confirmed }
    };
}

export const READ_ENV = 'READ_ENV';

export function readEnv (cwd) {
    return {
        type: READ_ENV,
        payload: { cwd }
    };
}

export const READ_RC_FILE = 'READ_RC_FILE';

export const readRcFile = ({ dir }) => ({
    type: READ_RC_FILE,
    payload: { dir }
});

export const READ_RC_FILE_ERROR = 'READ_RC_FILE_ERROR';

export const readRcFileError = error => ({
    type: READ_RC_FILE_ERROR,
    payload: { error },
    error: true
});

export const SCAFFOLD_ERROR = 'SCAFFOLD_ERROR';

export function scaffoldError(error) {
    return {
        type: SCAFFOLD_ERROR,
        payload: { error },
        error: true
    };
}

export const FILE_CREATED = 'FILE_CREATED';

export function fileCreated(path) {
    return {
        type: FILE_CREATED,
        payload: { path }
    };
}
