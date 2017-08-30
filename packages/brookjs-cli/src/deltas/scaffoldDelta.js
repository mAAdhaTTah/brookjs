import R from 'ramda';
import { Kefir } from 'brookjs';
import { RUN, CONFIRM_CONFIG, READ_ENV, READ_RC_FILE } from '../actions';
import { selectPkgContext, selectRcContext, selectAppJsContext,
    selectMakePath, selectMakeTemplate, selectMakeContext, isMakeCommand } from '../selectors';

export default R.curry(({ scaffold }, actions$, state$) => {
    const new$ = state$.sampledBy(actions$.ofType(CONFIRM_CONFIG)).take(1).delay(0)
        .flatMap(scaffold([
            {
                action: scaffold.CREATE,
                target: scaffold.ROOT,
                path: 'package.json',
                template: 'package.hbs.json',
                context: selectPkgContext
            },
            {
                action: scaffold.CREATE,
                target: scaffold.ROOT,
                path: '.beaverrc.js',
                template: 'beaverrc.hbs.js',
                context: selectRcContext
            },
            {
                action: scaffold.CREATE,
                target: scaffold.APP,
                path: 'app.js',
                template: 'app.hbs.js',
                context: selectAppJsContext
            },
            {
                action: scaffold.CREATE,
                target: scaffold.APP,
                path: 'dom.js',
                template: 'dom.hbs.js'
            },
            {
                action: scaffold.CREATE,
                target: scaffold.APP,
                path: 'view.hbs',
                template: 'view.hbs'
            },
            {
                action: scaffold.CREATE,
                target: scaffold.APP,
                path: 'actions/index.js',
                template: 'actions/index.hbs.js',
            },
            {
                action: scaffold.CREATE,
                target: scaffold.APP,
                path: 'actions/app.js',
                template: 'actions/app.hbs.js',
            },
            {
                action: scaffold.CREATE,
                target: scaffold.APP,
                path: 'deltas/index.js',
                content: '\n'
            },
            {
                action: scaffold.CREATE,
                target: scaffold.APP,
                path: 'reducers/index.js',
                content: '\n'
            },
            {
                action: scaffold.CREATE,
                target: scaffold.APP,
                path: 'selectors/index.js',
                template: 'selectors/index.hbs.js',
            },
            {
                action: scaffold.CREATE,
                target: scaffold.APP,
                path: 'services/index.js',
                content: '\n'
            },
            {
                action: scaffold.CREATE,
                target: scaffold.APP,
                path: 'components/index.js',
                content: '\n'
            },
        ]));

    const make$ = state$.sampledBy(actions$.ofType(READ_RC_FILE, READ_ENV, RUN).bufferWithCount(3))
        .take(1).filter(isMakeCommand).flatMap(scaffold([{
            action: scaffold.CREATE,
            target: scaffold.APP,
            path: selectMakePath,
            template: selectMakeTemplate,
            context: selectMakeContext
        }]));

    return Kefir.merge([
        make$,
        new$
    ]);
});
