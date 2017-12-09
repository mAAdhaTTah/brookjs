export default ({ ui }, actions$, state$) =>
    state$.take(1).flatMap(state => ui.error(`Command not found: ${state.command.name}.`));
