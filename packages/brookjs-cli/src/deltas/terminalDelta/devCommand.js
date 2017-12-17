import R from 'ramda';
import { ofType, Kefir } from 'brookjs';
import Dashboard from 'webpack-dashboard';
import { lCommandTypeArg } from '../../lenses';
import { WEBPACK_DASHBOARD_EVENTS } from '../../actions';


export default (services, actions$, state$) => {
    return state$.take(1).flatMap(state => {
        switch (R.view(lCommandTypeArg, state)) {
            case 'app':
                return Kefir.fromCallback(cb => cb(new Dashboard({
                    color: 'green',
                    minimal: false,
                    title: 'brookjs :: webpack-dashboard'
                })))
                    .flatMap(dashboard =>
                        actions$.thru(ofType(WEBPACK_DASHBOARD_EVENTS)).flatMap(action =>
                            Kefir.stream(emitter => {
                                dashboard.setData(action.payload.events);

                                emitter.end();
                            })
                        )
                    );
            case 'tdd':
            default:
                return Kefir.never();
        }
    });
};

