import R from 'ramda';
import { Kefir } from 'brookjs';
import {} from '../actions';
import {} from '../selectors';

export default R.curry(({ /* services */ }, actions$, state$) => {
    // Create delta streams.

    return Kefir.merge([
        // Add new streams here.
    ]);
});
