import test from 'ava';
import { selectMakePath, selectMakeTemplate, selectMakeContext } from '../make';

const state = {
    command: {
        args: {
            type: 'delta',
            name: 'testDelta'
        }
    }
};

test('selectMakePath should get target path', t => {
    t.is('deltas/testDelta.js', selectMakePath(state));
});

test('selectMakeTemplate should get template file', t => {
    t.is('deltas/template.hbs.js', selectMakeTemplate(state));
});

test('selectMakeContext should get template context', t => {
    t.deepEqual({ name: 'testDelta' }, selectMakeContext(state));
});
