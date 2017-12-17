import R from 'ramda';
import { Kefir, ofType } from 'brookjs';
import { READ_RC_FILE } from '../../actions';
import { isTestCommand, getCommandType, isDevCommand } from '../../selectors';
import unitTestRunner from './unitTestRunner';

export default R.curry((services, actions$, state$) =>
    state$.sampledBy(actions$.thru(ofType(READ_RC_FILE))).take(1)
        .filter(action => isTestCommand(action) || isDevCommand(action))
        .flatMap(state => {
            switch (getCommandType(state)) {
                case 'unit':
                case 'tdd':
                    return unitTestRunner(services, actions$, state$);
                default:
                    // @todo emit error
                    return Kefir.never();
            }
        })
);
