import R from 'ramda';
import Kefir from 'kefir';
import { ofType } from 'brookjs';
import { lCommandTypeArg } from '../../lenses';
import { WEBPACK_COMPILED } from '../../actions';


export default ({ ui }, actions$, state$) => {
    return state$.take(1).flatMap(state => {
        switch (R.view(lCommandTypeArg, state)) {
            case 'app':
                return actions$.thru(ofType(WEBPACK_COMPILED)).flatMap(({ payload }) =>
                    ui.log('info', payload.stats.toString({ colors: true }))
                );
            case 'tdd':
            default:
                return Kefir.never();
        }
    });
};
