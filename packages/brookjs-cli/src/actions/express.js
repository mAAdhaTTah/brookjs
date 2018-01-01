export const EXPRESS_APP_CREATED = 'EXPRESS_APP_CREATED';

export const expressAppCreated = () => ({
    type: EXPRESS_APP_CREATED
});
export const EXPRESS_APP_LISTENING = 'EXPRESS_APP_LISTENING';

export const expressAppListening = address => ({
    type: EXPRESS_APP_LISTENING,
    payload: { address }
});
export const STORYBOOK_STARTUP_ERROR = 'STORYBOOK_STARTUP_ERROR';

export const storybookStartupError = error => ({
    type: STORYBOOK_STARTUP_ERROR,
    payload: { error },
    error: true,
});
