import 'core-js/fn/object/assign';
import 'core-js/fn/object/values';
import 'core-js/fn/set';
import 'core-js/fn/symbol';
import { Kefir } from 'brookjs';
import test from '../test';

test('consumes observables', t => {
    t.plan(1);

    return Kefir.constant(1)
        .map(val => t.equals(val, 1, 'observable output should match expected'));
});
