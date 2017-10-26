import R from 'ramda';
import { Kefir } from 'brookjs';
import { READ_RC_FILE } from '../../actions';
import { isTestCommand, getTestType } from '../../selectors';
import unitTestRunner from './unitTestRunner';

export default R.curry((services, actions$, state$) =>
    state$.sampledBy(actions$.ofType(READ_RC_FILE)).take(1).filter(isTestCommand)
        .flatMap(state => {
            switch (getTestType(state)) {
                case 'unit':
                    return unitTestRunner(services, actions$, state$);
                default:
                    // @todo emit error
                    return Kefir.never();
            }
        })
);
