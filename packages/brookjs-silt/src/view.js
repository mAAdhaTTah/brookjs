const $$initialized = Symbol('init');

export default (callback) => stream$ => {
    let previous = $$initialized;

    return stream$.withHandler((emitter, event) => {
        switch (event.type) {
            case 'end':
                emitter.end();
                break;
            case 'error':
                emitter.error(event.value);
                break;
            case 'value':
                const next = callback(event.value);

                if (previous === $$initialized || next !== previous) {
                    previous = next;
                    emitter.value(next);
                }
                break;
        }
    });
};
