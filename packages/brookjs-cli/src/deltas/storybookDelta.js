import { Kefir } from 'brookjs';
import { expressAppCreated, expressAppListening, storybookStartupError } from '../actions';
import { takeStateOnBootstrap, isDevStorybookCommand } from '../selectors';

export default ({ StorybookService }) => (actions$, state$) => {
    const start$ = takeStateOnBootstrap(state$, actions$)
        .filter(isDevStorybookCommand)
        .flatMap(state =>
            Kefir.zip([
                StorybookService.createApp(state),
                StorybookService.createRouter(state)
            ])
                .flatMap(([app, router]) => Kefir.concat([
                    Kefir.constant(expressAppCreated()),
                    StorybookService.listen(app, router, state)
                        .map(instance => expressAppListening(instance.address))
                ]))
        )
        .takeErrors(1).flatMapErrors(err => Kefir.constant(storybookStartupError(err)));

    return Kefir.merge([
        start$
    ]);
};
