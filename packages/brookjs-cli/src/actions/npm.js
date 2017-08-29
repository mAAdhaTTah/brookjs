export const NPM_COMMAND_FINISH = 'NPM_COMMAND_FINISH';

export const npmCommandFinish = code => ({
    type: NPM_COMMAND_FINISH,
    payload: { code }
});

export const NPM_COMMAND_OUTPUT = 'NPM_COMMAND_OUTPUT';

export const npmCommandOutput = output => ({
    type: NPM_COMMAND_OUTPUT,
    payload: { output }
});

export const NPM_COMMAND_SPAWNED = 'NPM_COMMAND_SPAWNED';

export const npmCommandSpawned = command => ({
    type: NPM_COMMAND_SPAWNED,
    payload: { command }
});
