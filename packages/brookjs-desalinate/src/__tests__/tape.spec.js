import 'core-js/fn/object/assign';
import 'core-js/fn/object/values';
import 'core-js/fn/set';
import 'core-js/fn/symbol';
import { Kefir } from 'brookjs';
import bl from 'bl';
import tape from '../tape';

function test (name, test, checkErrors) {
    tape.test(name, t => {
        const htest = tape.createHarness();
        htest.createStream().pipe(bl((_, data) => {
            checkErrors && checkErrors(data.toString().split('\n'), t);
        }));
        htest(t => test(t, htest));
    });
}

function verifyAsserts (counts) {
    return (lines, t) => {
        t.equal(count(lines, /^ok/), counts.ok, 'should have ' + counts.ok + ' ok asserts');
        t.equal(count(lines, /^not ok/), counts.fail, 'should have ' + counts.fail + ' failed asserts');
        t.end();
    };
}

function count (lines, regex) {
    let c = 0;
    for (let k = 0; k < lines.length; ++k) {
        if (regex.test(lines[k])) {
            ++c;
        }
    }
    return c;
}

test('normal tests', t => {
    t.ok(true);
    t.end();
}, verifyAsserts({ ok: 1, fail: 0 }));

test('simple delay',
    () => Kefir.later(0, 1),
    verifyAsserts({ ok: 0, fail: 0 }));

test('should not affect plan', t => {
    t.plan(2);
    t.ok(true);
    t.ok(true);

    return Kefir.constant(1);
}, verifyAsserts({ ok: 2, fail: 0 }));

test('nested tests with observables', t => {
    t.test('delay1', () =>
        Kefir.later(0, 1)
    );

    t.test('delay2', () =>
        Kefir.later(0, 1)
    );
}, verifyAsserts({ ok: 0, fail: 0 }));

test('chained observables', t => {
    t.plan(2);

    return Kefir.later(20, true).map(val => t.ok(val))
        .flatMap(() => Kefir.later(40, true))
        .map(val => t.ok(val));
}, verifyAsserts({ ok: 2, fail: 0 }));

test('should error',
    () => Kefir.constantError(new Error),
    verifyAsserts({ ok: 0, fail: 1 }));

test('run tape with only', (t, htest) => {
    let count = 0;

    htest('first', t => {
        t.equal(++count, 1);
        t.end();
    });

    htest.only('second', function (t) {
        t.equal(++count, 1);
        t.end();
    });

    t.end();
}, verifyAsserts({ ok: 1, fail: 0 }));
