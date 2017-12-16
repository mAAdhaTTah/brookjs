import { Kefir } from 'brookjs';
import { webpackCompiled } from '../actions';
import { isBuildCommand, selectWebpackConfig, takeStateOnBootstrap } from '../selectors';

export default ({ webpack }) => (actions$, state$) => {
    const bootstrap$ = takeStateOnBootstrap(state$, actions$);

    const build$ = bootstrap$.filter(isBuildCommand)
        .flatMap(state =>
            webpack.create(selectWebpackConfig(state))
                .flatMap(compiler => compiler.run())
                .map(webpackCompiled)
        );

    return Kefir.merge([
        build$
    ]);
};
