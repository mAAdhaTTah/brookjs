import { test } from 'brookjs-desalinate';
import R from 'ramda';
import { lCommandName } from '../../lenses';
import { isMakeCommand, selectMakePath, selectMakeTemplate, selectMakeContext } from '../make';

const state = {
    command: {
        name: 'make',
        args: {
            type: 'delta',
            name: 'testDelta'
        }
    }
};

test('isMakeCommand returns true when running make', t => {
    t.plan(1);

    t.true(isMakeCommand(state));
});

test('isMakeCommand returns false when not running make', t => {
    t.plan(1);

    t.false(isMakeCommand(R.set(lCommandName, 'new', state)));
});

test('selectMakePath should get target path', t => {
    t.plan(1);

    t.is('deltas/testDelta.js', selectMakePath(state));
});

test('selectMakeTemplate should get template file', t => {
    t.plan(1);

    t.is('deltas/template.hbs.js', selectMakeTemplate(state));
});

test('selectMakeContext should get template context', t => {
    t.plan(1);

    t.deepEqual({ name: 'testDelta' }, selectMakeContext(state));
});
