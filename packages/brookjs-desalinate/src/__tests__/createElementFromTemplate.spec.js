import 'core-js/fn/object/assign';
import 'core-js/fn/object/values';
import 'core-js/fn/set';
import 'core-js/fn/symbol';
import test from '../tape';
import createElementFromTemplate from '../createElementFromTemplate';

test('it creates element from template function', t => {
    t.plan(2);

    const template = () => '<div>Test Element</div>';
    const state = {};

    const element = createElementFromTemplate(template, state);

    t.equals(element.nodeName, 'DIV', 'element was not a div');
    t.equals(element.textContent, 'Test Element', 'element had incorrect text');
});
